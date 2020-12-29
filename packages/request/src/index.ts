import { InitializeOptions, ResponseExtra, RequestInitExtra } from "./types";
import { $Request } from "./request";
import { $Response } from "./response";

export const initialize = (original: typeof fetch, options: InitializeOptions = {}) => {
  const request = async <T = any>(
    input: RequestInfo,
    init: RequestInitExtra<T> = {}
  ): Promise<ResponseExtra<T>> => {
    const requsetExtra = new $Request(input, init, original);
    requsetExtra.setHeaders(options.headers || {});
    requsetExtra.parseBody();

    const responseExtra = new $Response(await requsetExtra.flush(), init);
    await responseExtra.parseBody();
    await responseExtra.defineOk();

    return responseExtra.flush();
  };

  return request;
};

export * from "./types";
