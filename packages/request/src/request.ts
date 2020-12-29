import { RequestInitExtra } from "./types";
import "./polyfill";

export class $Request<T> {
  constructor(
    private input: RequestInfo,
    private init: RequestInitExtra<T> = {},
    private originalFetch: typeof fetch
  ) {}

  public setHeaders = (headers: Record<string, string>) => {
    Object.entries(headers).forEach(([key, value]) => {
      if (!this.init.headers) {
        this.init.headers = { [key]: value };
      } else if (typeof Headers !== "undefined" && this.init.headers instanceof Headers) {
        this.init.headers.set(key, value);
      } else if (Array.isArray(this.init.headers)) {
        this.init.headers.push([key, value]);
      } else {
        (this.init.headers as Record<string, string>)[key] = value;
      }
    });
  };

  public parseBody = () => {
    const { headers, body } = this.init;
    if (
      !body ||
      typeof body === "string" ||
      body instanceof String ||
      body instanceof Blob ||
      body instanceof FormData ||
      (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) ||
      (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
    ) {
      return;
    }
    try {
      this.init.body = JSON.stringify(body);
    } catch (e) {
      console.warn(`Unable to parse given body - ${e.message}`);
      return;
    }
    let hasContentType = false;
    if (headers) {
      if (typeof Headers !== "undefined" && headers instanceof Headers) {
        hasContentType = !!headers.get("Content-Type") || !!headers.get("content-type");
      } else if (Array.isArray(headers)) {
        hasContentType = headers.some(([name]) => ["content-type", "Content-Type"].includes(name));
      } else {
        hasContentType =
          !!(headers as Record<string, string>)["Content-Type"] ||
          !!(headers as Record<string, string>)["content-type"];
      }
    }
    if (!hasContentType) {
      this.setHeaders({ "Content-Type": "application/json" });
    }
  };

  public flush = () =>
    this.originalFetch(this.input, this.init as RequestInit).catch((error: Error) => {
      if (this.init.onNetworkError) {
        this.init.onNetworkError(error);
      } else if (this.init.actions?.network) {
        this.init.actions.network(error as any);
      }
      throw error;
    });
}
