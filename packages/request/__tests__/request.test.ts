import nodeFetch from "node-fetch";
import nock from "nock";

import { initialize, RequestInitExtra } from "../src";

const mock = [
  { id: "5036ae04-d33a-49e3-8c84-5cbe8691a427", data: "" },
  { id: "4ab4bd77-c574-4483-ba78-747ae1a6f6c3", data: "" },
  { id: "be1f3640-0f31-482e-a574-ea8665d9a1e0", data: "" },
  { id: "3147ac8a-528e-4c73-ad1c-a16647c6ef3b", data: "" },
  { id: "de5c2f66-f0e7-457a-930f-16f9fd766de5", data: "" },
];

describe("request", () => {
  const request = initialize(nodeFetch as any);

  describe("initialize", () => {
    it("should return function", async () => {
      expect(typeof initialize(nodeFetch as any)).toBe("function");
    });

    it("should accept prefilled headers", async (end) => {
      const scope = nock("https://api.example.com")
        .persist()
        .get("/headers")
        .reply(function (uri, requestBody) {
          expect(this.req.headers["content-type"]).toEqual(["application/json"]);
          expect(this.req.headers["custom-header"]).toEqual(["some/value"]);
          return [200];
        });
      const requestWithHeaders = initialize(nodeFetch as any, {
        headers: {
          "content-type": "application/json",
          "custom-header": "some/value",
        },
      });
      const response = await requestWithHeaders("https://api.example.com/headers");

      expect(response.status).toBe(200);
      scope.done();
      end();
    });
  });

  it(".json() ans .text() shouldn't reuse stream, and be able to call multiple times", async (end) => {
    const scope = nock("https://api.example.com").persist().get("/items").reply(200, mock);
    const response = await request("https://api.example.com/items");
    expect(response.json()).toEqual(mock);
    expect(response.text()).toEqual(JSON.stringify(mock));
    scope.done();
    end();
  });

  it("shouldThrow should specify, if request should throw error in case NOT_OK response", async (end) => {
    const scope = nock("https://api.example.com")
      .persist()
      .get("/authError")
      .reply(403, "unauthorized");
    const makerequest = (options: RequestInitExtra<any>) => () =>
      request("https://api.example.com/authError", options);
    await expect(makerequest({})).not.toThrow();
    try {
      await makerequest({ shouldThrow: true })();
    } catch (e) {
      expect(e.ok).toBeFalsy();
      expect(e.status).toBe(403);
      end();
    }
    scope.done();
  });

  it("isOk should provide way to define if request was 'OK'", async (end) => {
    const scope = nock("https://api.example.com").persist().get("/wierdCode").reply(429);
    expect((await request("https://api.example.com/wierdCode")).ok).toBeFalsy();
    expect(
      (
        await request("https://api.example.com/wierdCode", {
          isOk: () => {
            return true;
          },
        })
      ).ok
    ).toBeTruthy();
    try {
      await request("https://api.example.com/wierdCode", {
        isOk: () => {
          return false;
        },
        shouldThrow: true,
      });
    } catch (e) {
      expect(e.ok).toBeFalsy();
      expect(e.status).toBe(429);
      end();
    }
    scope.done();
    end();
  });

  it("should stringify object-like body and set header", async (end) => {
    const body = {
      username: "user",
      password: "123qwe",
    };
    const scope = nock("https://api.example.com")
      .persist()
      .post("/login", { username: /.+/, password: /.+/i })
      .reply(function (uri, requestBody) {
        expect(requestBody).toEqual(body);
        expect(this.req.headers["content-type"]).toEqual(["application/json"]);
        return [200];
      });
    const response = await request("https://api.example.com/login", {
      method: "post",
      body,
    });
    expect(response.status).toBe(200);
    scope.done();
    end();
  });

  it("should kepp body as it, if cannot stringify", async (end) => {
    const body: Record<string, any> = {
      username: "user",
      password: "123qwe",
    };

    body.circular = body;
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    const scope = nock("https://api.example.com")
      .persist()
      .post("/login", { username: /.+/, password: /.+/i, circular: /.*/ })
      .reply(function (uri, requestBody) {
        expect(requestBody).toEqual(body);
        expect(this.req.headers["content-type"]).toEqual(["application/json"]);
        return [200];
      });
    await request("https://api.example.com/login", {
      method: "post",
      body,
    }).catch(() => null);
    expect(spy).toBeCalledWith(
      expect.stringMatching(/Unable to parse given body - Converting circular structure to JSON/)
    );
    spy.mockRestore();
    end();
  });

  describe("should call side effects accordingly actions object", () => {
    const scope = nock("https://api.example.com").persist().get("/200").reply(200);
    scope.get("/400").reply(400);
    scope.get("/500").reply(500);
    scope.get("/204").reply(204);

    it("should exec 200 and ok actions if request status ok", async (end) => {
      const actions = {
        "200": jest.fn(),
        ok: jest.fn(),
        fail: jest.fn(),
        default: jest.fn(),
        "400-415": jest.fn(),
        "500,504": jest.fn(),
      };

      await request("https://api.example.com/200", { actions: actions });
      expect(actions.ok).toBeCalled();
      expect(actions[200]).toBeCalled();
      expect(actions.fail).not.toBeCalled();
      expect(actions["400-415"]).not.toBeCalled();
      expect(actions["500,504"]).not.toBeCalled();
      end();
    });

    it("should exec fail action if request was not ok", async (end) => {
      const actions = {
        "200": jest.fn(),
        ok: jest.fn(),
        fail: jest.fn(),
        default: jest.fn(),
        "400-415": jest.fn(),
        "500,504": jest.fn(),
      };

      await request("https://api.example.com/400", { actions: actions });
      expect(actions.ok).not.toBeCalled();
      expect(actions[200]).not.toBeCalled();
      expect(actions.fail).toBeCalled();
      end();
    });

    it("should exec action if request status fits in range", async (end) => {
      const actions = {
        "200": jest.fn(),
        ok: jest.fn(),
        fail: jest.fn(),
        default: jest.fn(),
        "400-415": jest.fn(),
        "500,504": jest.fn(),
      };

      await request("https://api.example.com/400", { actions: actions });
      expect(actions["400-415"]).toBeCalled();
      expect(actions["500,504"]).not.toBeCalled();
      await request("https://api.example.com/500", { actions: actions });
      expect(actions["400-415"]).toBeCalledTimes(1);
      expect(actions["500,504"]).toBeCalled();
      end();
    });

    it("should exec network action if request failed with NETERROR", async (end) => {
      const actions = {
        "200": jest.fn(),
        ok: jest.fn(),
        fail: jest.fn(),
        default: jest.fn(),
        network: jest.fn(),
        "400-415": jest.fn(),
        "500,504": jest.fn(),
      };

      try {
        await request("https://.com/400", { actions: actions });
      } catch (e) {

      }
      expect(actions.network).toBeCalled();
      expect(actions["400-415"]).not.toBeCalled();
      expect(actions["500,504"]).not.toBeCalled();
      end();
    });

    it("should exec default action if no other actions was executed", async (end) => {
      const actions = {
        "200": jest.fn(),
        fail: jest.fn(),
        default: jest.fn(),
        "400-415": jest.fn(),
        "500,504": jest.fn(),
      };

      await request("https://api.example.com/204", { actions: actions });
      expect(actions[200]).not.toBeCalled();
      expect(actions.fail).not.toBeCalled();
      expect(actions.default).toBeCalled();
      end();
    });

    afterAll(() => {
      scope.done();
    });
  });

  describe('onNetworkError', () => {
    const scope = nock("https://api.example.com")
      .persist()
      .get("/200")
      .reply(200);

    it('call onNetworkError, in case of network error', async (end) => {
      const onNetworkError = jest.fn();
      try {
        await request("https://.com", { onNetworkError });
      } catch (e) {

      }
      expect(onNetworkError).toBeCalled();
      end();
    });

    afterAll(() => {
      scope.done();
    });
  })
});
