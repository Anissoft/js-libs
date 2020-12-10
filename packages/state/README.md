# @anissoft/state

Primitive, lightweight and well typed observables.

## Installation

Just run [`npm install`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally) command:

```bash
$ npm install @anissoft/state --save
```

## Usage

```typescript
import State from "@anissoft/state";

type User = {
  name: string;
  gender: "male" | "female";
  age: number;
};
const currentUser = new State<User>({ name: "Jeremy", age: 25 });
```

## Author

👤 \*\*Alexey Anisimov

- Github: [@Anissoft](https://github.com/Anissoft)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/Anissoft/js-libs/issues).
