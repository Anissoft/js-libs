# Welcome to @anissoft/request 👋

<!-- [![Version](https://img.shields.io/npm/v/request.svg)](https://www.npmjs.com/package/request) -->
<!-- [![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/Anissoft/request#readme) -->
<!-- [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Anissoft/request/graphs/commit-activity) -->

> Wrap on top of the standart fetch API with few tweaks, which make may life easier

## Installation

```sh
npm install @anissoft/request
```

## Usage

You just need to intitalize and export request function:

```typescript
// request.ts
import { initialize } from "@anissoft/request";
export const request = initialize(fetch, options);
```

After it you can import and use it:

```typescript
import request from "../request";

(async () => {
  try {
    const response1 = await request("https://example.com/api/method", {
      method: "POST",
      body: { foo: "bar" },
      isOk: ({ status }) => status < 400,
      shouldThrow: true,
    });
    console.log("Response body:", response1.text());
    console.log("Parsed json:", response1.json());
  } catch (response1) {
    console.error(response1.statusText);
  }

  // equivalent for
  const response2 = await fetch("https://example.com/api/method", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ foo: "bar" }),
  });
  if (response2.status >= 400) {
    console.error(response2.statusText);
  } else {
    const text = await response2.text();
    console.log("Response body:", text);
    try {
      console.log("Parsed json:", JSON.parse(text));
    } catch (e) {
      console.log("Parsed json:", undefined);
    }
  }
})();
```

## Features

#### isOk

You can specify custom condition in RequestInit to define if response is _ok_:

```typescript
request("https://example.com/api/method", {
  isOk: ({ status }) => status < 400 || status === 429,
});
```

#### shouldThrow

If `shouldThrow` set true in RequestInit - request will be rejected if response.ok is falsy:

```typescript
request("https://example.com/api/method", {
  shouldThrow: true,
}).catch((response) => {
  console.log(response.status);
});
```

#### Stringify object-like body

... and automaticaly set 'Content-Type' header in 'application/json':

```typescript
request("https://example.com/api/method", {
  method: "POST",
  body: { foo: "bar" },
});
```

#### Sync .json() and .text() methods

.json() and .text() methods contains preparsed data and can be executed synchronously multiple times:

```typescript
const response = request("https://example.com/api/method");

console.log(response.text());
console.log(response.json());
```

#### `actions` object

You can assign actions for specific status codes, or general events:

```typescript
request("https://example.com/api/method", {
  method: "POST",
  isOk: ({ status, ok }) => ok || status === 429,
  actions: {
    ok: (response) => {
      console.log("Executes if response.ok === true, or if isOk() returns true");
    },
    "403": (response) => {
      console.log("Executes if response.status === 403");
    },
    "401,402": (response) => {
      console.log("Executes if response.status is 401 or 402");
    },
    "500-516": (response) => {
      console.log("Executes if response.status >= 500 and response.status <= 516");
    },
    network: (response) => {
      console.log("Executes network exception was thrown");
    },
    default: (response) => {
      console.log("Executes in all other cases");
    },
  },
});
```

## Helpers

#### getParameterByName(name: string[, url: string])

Returns the last value of query parameter from given url. If no url specified - will use global location.href in browser, or empty string in NodeJS.

```typescript
const { getParameterByName } = require("@anissoft/request");

const search = getParameterByName("search", "https://example.com/api/method?search=123");
console.log(search); // '123';
```

## Author

👤 **Alexey Anisimov**

- Github: [@Anissoft](https://github.com/Anissoft)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/Anissoft/request/issues).
