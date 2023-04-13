# Welcome to @anissoft/react-di 👋

> My attempt to make inversion-of-control for React apps with Reflect Metadata and Typescript;

## Install

```sh
npm install @anissoft/react-di --save
```

## Usage

First of all - you need to declare interfaces for your services:

```tsx
// interfaces.ts
export interface ISessionClient {
  createSession(): Promise<Response>;
  removeSession(): Promise<Response>;
}

export interface IUser {
  username: string;
  email: string;

  sessionClient: ISessionClient;

  login(): Promise<void>;
  logout(): Promise<void>;
}
```

Then, you should write some classes to implement these interfaces. Use `@Service()` to mark them as service, and `@Inject(tagname)` to define dependency:

```typescript
// services.ts
import { Service, Inject } from "@anissoft/react-di";
import { IUser, ISessionClient } from "./interfaces";

@Service()
export class SessionClient implements ISessionClient {
  public async createSession() {
    return fetch("/api/method/to/create/session");
  }

  public async removeSession() {
    return fetch("/api/method/to/remove/session");
  }
}

@Service()
export class SessionClientMock implements ISessionClient {
  public async createSession() {
    return new Promise<Response>((res) => {
      setTimeout(() => res(new Response(MOCKED_CREATE)), 1000);
    });
  }

  public async removeSession() {
    return new Promise<Response>((res) => {
      setTimeout(() => res(new Response(MOCKED_REMOVE)), 1000);
    });
  }
}

@Service()
export class User implements IUser {
  public username = "Boris Sshec";
  public email = "boris1991@example.com";

  @Inject("SESSION_CLIENT")
  private sessionClient!: SessionClient;

  public async login() {
    await this.sessionClient.createSession();
  }

  public async logout() {
    await this.sessionClient.removeSession();
  }
}
```

Write react components, which should have acces to your services inside them. Use `useService` hook for that:

```tsx
// Userview.tsx
import { Provider } from "@anissoft/react-di";
import { Iuser } from "./interfaces";

export const UserView = () => {
  const user = useService<IUser>("USER");

  return (
    <>
      <span>Username - {user.username}</span>
      <span>User email - {user.email}</span>
      <button type="button" onClick={user.logout}>
        Logout
      </button>
    </>
  );
};
```

And finally - pass in `ServiceProvider` those classes that you need for services. You can configure, which implementation will be resolved by tag-names:

```tsx
import { ServiceProvider } from "@anissoft/react-di";
import { User, SessionClient, SessionClientMock } from "./services";
import { UserView } from "./Userview";

const RootComponent = () => {
  return (
    <ServiceProvider
      services={{
        USER: User,
        SESSION_CLIENT: SessionClient,
      }}
    >
      <Userview />
    </ServiceProvider>
  );
};

// ...OR

const DevRootComponent = () => {
  return (
    <ServiceProvider
      services={{
        USER: User,
        SESSION_CLIENT: SessionCLientMock,
      }}
    >
      <Userview />
    </ServiceProvider>
  );
};
```

### @Service and @Inject

You can use `@Inject` on constructors parameters as well as on class properties:

```typescript
@Service()
class Test {
  @Inject("DEPENDENCY_1")
  private propertyDependency!: Dependency1;
  // note that "!" after property name
  // it helps to get rid of some typescript errors

  constructor(@Inject("DEPENDENCY_2") public parameterDependency: Dependency2) {
    // ...
  }
}
```

It's also highly recommended to keep tag-names in separate object, instead of using string literals every time:

```typescript
const tags = {
  dependency: Symbol("dependency"),
  master: Symbol("master"),
};

@Service()
class Dependency {
  constructor() {}
}

@Service()
class Master {
  constructor(@Inject(tags.dependency) public dependency: Dependency) {}
}
```

### ServiceProvider and ServiceConsumer

If yu using `React.Components` you can use `ServiceConsumer` instead of `useService` hook:

```tsx
const tags = {
  dependency: Symbol('dependency'),
  master: Symbol('master'),
}

@Service()
class Dependency {
  constructor(){}
}

@Service()
class Master {
  constructor(
    @Inject(tags.dependency) public dependency: Dependency,
  ){ }
}

const Child = () => {
  return (
    <ServiceConsumer>
      {(container) => {
        console.log(container); // <--
        return <>Child</>;
      }}
    </ServiceConsumer>
  )
}

const Root = () => (
  <ServiceProvider
    services={{
      [tags.dependency]: Dependency,
      [tags.master]: Master,
    }}
  >
    <Child />
  </ServiceProvider>,
);
```

## Author

👤 **anissoftkun@gmail.com**

- Github: [@anissoft](https://github.com/anissoft)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/Anissoft/js-libs/issues).

## Show your support

Give a ⭐️ if this project helped you!
