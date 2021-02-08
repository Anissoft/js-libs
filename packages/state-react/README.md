# Welcome to @anissoft/state-react 👋

## Installation

Just run [`npm install`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally) command:

```bash
$ npm install @anissoft/state-react --save
```

## Usage

You can access state object in your React components via handy [hook](https://reactjs.org/docs/hooks-overview.html)

```tsx
import * as React from 'react';
import { useStateObject } from '@anissoft/state-react';

function Countdown(props: { start: number }) {
  const state = useStateObject({ timeLeft: start });

  React.useEffect(
    () => {
      const interval = setInterval(
        () => {
          if ( state.timeLeft === 0) {
            clearInterval(interval);
          } else {
           state.timeLeft = state.timeLeft - 1;
          }
        },
        1000,
      ); 

      return () => clearInterval(interval);
    [],
  );

  return (
    <div>
      <span>Seconds left {state.timeLeft}</span>
    </div>
  )
}
```

``useStateObject`` can accept already created State object as agrument:

```tsx
import * as React from 'react';
import { useStateObject } from '@anissoft/state-react';

import myState from 'Models/state';

function Component() {
  const state = useStateObject(myState);
  
  React.useEffect(() => {
    return myState.subscrube(() => {
      /* ... */
    })
  }, []);

  return (
    <div>
      {/* ... */}
    </div>
  )
}
```

You can pass comparator as second argument, to specify condition when hook should initiate component rerender:

```tsx
import * as React from 'react';
import { useStateObject } from '@anissoft/state-react';

function Countdown({ timeout }: { timeout: number }) {
  const state = useuseStateObjectBox({ timeLeft: timeout }, (newValue) => newValue.timeLeft >= 0);

  React.useEffect(
    () => {
      const interval = setInterval(
        () => {
          newValue.timeLeft = newValue.timeLeft - 1;
        },
        1000,
      ); 

      return () => clearInterval(interval);
    },
    [],
  );

  return (
    <div>
      <span>{`Seconds left ${state.timeLeft}`}</span>
    </div>
  )
}
```

## Author

👤 **Alexey Anisimov**

- Github: [@Anissoft](https://github.com/Anissoft)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/Anissoft/box/issues).