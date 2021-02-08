import { ResponseExtra, RequestInitExtra } from "./types";
import "./polyfill";

export class $Response<T> {
  private candidate: ResponseExtra<T>;

  constructor(private response: Response, private init: RequestInitExtra<T>) {
    let candidate: Response;
    if (typeof Response !== "undefined") {
      candidate = new Response(undefined, this.response);
    } else {
      const [body, info] = (Object.getOwnPropertySymbols(this.response) as unknown) as string[];
      const keys = Object.keys(this.response);
      candidate = ({
        body: (this.response as Record<string, any>)[body],
        ...(this.response as Record<string, any>)[info],
      } as unknown) as Response;
      [...keys].forEach((key) => {
        (candidate as Record<string, any>)[key] = (this.response as Record<string, any>)[key];
      });
    }

    this.candidate = (Object.assign(candidate, {
      json() {
        return {};
      },
      text() {
        return "";
      },
    }) as unknown) as ResponseExtra<T>;
  }

  public parseBody = async () => {
    const text = await this.response.text();

    let json: T | undefined;
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = undefined;
    }

    Object.assign(this.candidate, {
      json() {
        return json;
      },
      text() {
        return text;
      },
    }) as ResponseExtra<T>;
  };

  public defineOk = () => {
    if (this.init?.isOk) {
      Object.defineProperty(this.candidate, "ok", {
        value: this.init.isOk(this.candidate),
        writable: false,
      });
    } else if (!this.candidate.hasOwnProperty("ok")) {
      Object.defineProperty(this.candidate, "ok", {
        value: this.candidate.status >= 200 && this.candidate.status <= 308,
        writable: false,
      });
    }
  };

  public flush = () => {
    if (this.init?.actions) {
      const actions = Object.entries(this.init.actions)
        .filter(([key]) => {
          if (key === "network") {
            return false;
          }
          if (key === "default") {
            return false;
          }
          if (key === "ok") {
            return !!this.candidate.ok;
          }
          if (key === "fail") {
            return !this.candidate.ok;
          }
          if (typeof key === "string" && /^\d{3}\-\d{3}$/.test(key)) {
            const [start, end] = key.split("-");
            return this.candidate.status >= +start && this.candidate.status <= +end;
          }
          if (typeof key === "string" && /^(\d{3},+)+\d{3}$/.test(key)) {
            const codes = key.split(",");
            return codes.includes(`${this.candidate.status}`);
          }
          return this.candidate.status === +key;
        })
        .map(([key, action]) => action);

      if (actions && actions.length > 0) {
        actions.forEach((action) => {
          action!(this.candidate as any);
        });
      } else {
        const [, defautAction] =
          Object.entries(this.init?.actions).find(([key]) => key === "default") || [];
        if (defautAction) {
          defautAction(this.candidate);
        }
      }
    }
    if (this.init?.shouldThrow && !this.candidate.ok) {
      return Promise.reject(this.candidate);
    }
    return Promise.resolve(this.candidate);
  };
}
