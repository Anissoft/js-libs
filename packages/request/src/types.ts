export type InitializeOptions = {
  headers?: Record<string, string>;
  // mockResponse
};

export type ResponseExtra<T> = {
  json(): T | undefined;
  text(): string;
} & Omit<Response, "json" | "text">;

export type RequestInitExtra<T> = {
  body?:
    | Blob
    | BufferSource
    | FormData
    | URLSearchParams
    | ReadableStream<Uint8Array>
    | string
    | Record<string | number, any>;
  isOk?: (response: ResponseExtra<T>) => boolean;
  shouldThrow?: boolean;
  onNetworkError?: (error: Error) => void;
  actions?: {
    [key in string | number]: (response: ResponseExtra<T>) => void;
  };
} & Omit<RequestInit, "body">;
