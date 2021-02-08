# Welcome to @anissoft/state 👋

Primitive, lightweight and well typed observables.

## Installation

Just run [`npm install`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally) command:

```bash
$ npm install @anissoft/state --save
```

## Usage

You need to create State instance with specific type and pass initial value:

```typescript
import State from "@anissoft/state";

type User = {
  name: string;
  gender: "male" | "female";
  age: number;
};

const currentUser = new State<User>({
  name: "Jeremy",
  age: 25,
  gender: "male",
});

currentUser.value;
// stdout: { name: "Jeremy", age: 25, gender: "male" }

currentUser.get();
// stdout: { name: "Jeremy", age: 25, gender: "male" }

const unsubscribe = currentUser.subscribe((newValue, oldValue) => {
  console.log("Changed user info");
});

currentUser.value.age = 32;
// stdout: "Changed user info"

currentUser.get();
// stdout: { name: "Jeremy", age: 32, gender: "male" }

currentUser.set((value) => ({ ...value, name: "Mike" }));
// stdout: "Changed user info"

unsubscribe();
```

You can replace whole value and still has all observers running properly:

```typescript
currentUser.value = {
  name: "Mike",
  age: 19,
  gender: "male",
};
// stdout: "Changed user info"
```

You can specify condition, when observer should execute provided callback:

```typescript
const currentUser = new State({
  name: "Mike",
  age: 25,
  gender: "male",
});

const unsubscribe = currentUser.subscribe(
  (newValue, oldValue) => {
    const oldName = oldValue.name;
    const newName = newValue.name;
    console.log(`Changed username from ${oldName} to ${newName}.`);
  },
  (newValue, oldValue) => newValue.name !== oldValue.name
);

currentUser.value.age = 32;
// stdout nothing

currentUser.value.name = "Johannen";
// stdout: Changed username from Mike to Johannen
```

Common use case - classes that extends State class:

```typescript
type UserData = {
  login: string;
  firstname: string;
  lastname: string;
  preferences?: Record<string, string>
}
class User extends State<UserData> {
  constructor(initials: UserData) {
    super(initials);
    ...
  }

  public savePreferences(preferences) {
    this.set({ preferences })
  }
  ...
}
```

## Author

👤 **Alexey Anisimov**

- Github: [@Anissoft](https://github.com/Anissoft)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/Anissoft/js-libs/issues).
