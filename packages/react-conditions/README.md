# Welcome to @anissoft/react-conditions 👋

Helpers for conditional rendering in React

## Installation

Just run [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @anissoft/react-conditions
```

## Components:

### - \<If [condition] />

```js
import * as React from 'react';
import { render } from 'react-dom';
import { If, Then, Else } from '@anissoft/react-conditions'

import MainApp from 'Components/Main';
import Error from 'Components/Error';

...

render(
  <div>
    <If condition={!isErrored}>
      <Then>
        <MainApp/>
      </Then>
      <Else>
        <Error/>
      </Else>
    </If>
  </div>,
  document.getElementById('app-root'),
);
```

also, there is a shortener for case without else:

```js
<div>
  <If condition={!isErrored}>
    <MainApp />
  </If>
</div>
```

Then and Else can receive a callbacks as children - that allows you to safely use inside them methods, props and variables

```js
  <div>
    <If condition={!!foo} >
      <Then>
        {() => <p>{`Here some value for you ${foo.bar()}`}</p>}
      </Then>
    </If>
  </div>
}
```

### - \<Wrapper [condition] />

Conditional render like in < If />, but this time for wrapping components

```js
import * as React from 'react';
import { render } from 'react-dom';
import { Wrapper } from '@anissoft/react-conditions'

import MainApp from 'Components/Main';
import MobleViewWrapper from 'Components/Mobile';

...

render(
  <div>
    <Wrapper condition={isMobile} wrapper={MobleViewWrapper}>
      <MainApp/>
    </Wrapper>
  </div>,
  document.getElementById('app-root'),
);
```

also, can be used with function `wrap` as wrapper

```js
import * as React from 'react';
import { render } from 'react-dom';
import { Wrapper } from '@anissoft/react-conditions'

import MainApp from 'Components/Main';
import MobleViewWrapper from 'Components/Mobile';

...
const wrapIn = (children) => {
  ...
  return <MobleViewWrapper>{children}</MobleViewWrapper>
}

render(
  <div>
    <Wrapper condition={isMobile} wrap={wrapIn}>
      <MainApp/>
    </Wrapper>
  </div>,
  document.getElementById('app-root'),
);
```

### - \<Switch>

Conditional render, but for several conditions. Simple implementation of javascript switch

```js
import * as React from 'react';
import { render } from 'react-dom';
import { Switch, Case, Default } from '@anissoft/react-conditions'

import AdminView from 'Components/Admin';
import UserView from 'Components/User';
import DefaultView from 'Components/Default';

...

render(
  <div>
    <Switch>
      <Case condition={ userRole === 'admin' }>
        <AdminView />
      </Case>
      <Case condition={ userRole === 'regular' }>
        <UserView />
      </Case>
      <Default>
        <DefaultView />
      </Default>
    </Switch>
  </div>,
  document.getElementById('app-root'),
);
```

Can render several positive cases

```js
render(
  <div>
    <Switch>
      <Case condition={userRoles.includes("admin")}>
        <AdminView />
      </Case>
      <Case condition={userRole.includes("regular")}>
        <UserView />
      </Case>
      <Default>
        <DefaultView />
      </Default>
    </Switch>
  </div>,
  document.getElementById("app-root")
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
