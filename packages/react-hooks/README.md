# React Hooks

Just bunch of hooks, that I commonly use in my code

## Installation

Just run [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @anissoft/react-hooks
```

### - useMounted()

Shortway for 'didMount' property

```js
import * as React from 'react'
import If from '@anissoft/react-helpers/components/If'
import useMounted from '@anissoft/react-hooks/useMounted'

export default () => {
  const { mounted } = useMounted()

  return (
    <div>
      {mounted ? (
        <p>Component just renders</p>
      ) : (
        <p>Component was rendered before</p>
      )}
    </div>
  )
}
```

useMounted also returns function, that allows you to check if component still mounted and prevent memory leak

```js
export default () => {
  const { isMounted } = useMounted()
  const [state, setState] = React.useState(0)

  React.useEffect(() => {
    fetch('/some/api').then(res => {
      if (isMounted()) {
        setState(res.ok)
      }
    })
  }, [])

  return <div>💣</div>
}
```

### - useSharedState(key, defaultState)

Can access state and setState method with this hook in any place at your application (by uniq id)

```js
import * as React from 'react';
import { useSharedState, SharedStateProvider } from '@anissoft/react-hooks/useSharedState';

import { globalStateKey, globalDefaultState } from './stateKeys'

const Parent = () => {
  const [state, setState] = useSharedState(globalStateKey, globalDefaultState);

  return (
    <SharedStateProvider>
      // ...
        <DeepChild />  
      // ...
    </SharedStateProvider>
  )
}

const DeepChild = () => {
  const [state, setState] = useSharedState(globalStateKey, globalDefaultState);

  // ...
}

```

### - useSet(initialValue)

Returns instance of Set, witch triggers rerender on its changes (.add, .delete and .clear methods)

```js
import * as React from 'react'
import useSet from '@anissoft/react-hooks/useSet'

const Example = () => {
  const numbers = useSet([1,2,3]);
  const add4 = () => number.add(4); // invokes rerender only once, since next time "4" will be already in Set

  return (
    <>
    <span>total numbers - {numbers.size}</span>
    <button onClick={add4}>add number 4</button>
    <ul>
      {[...numbers].map(number => <li>{number}</li>);}
    </ul>
    </>
  )
};

```

### - useDebouncedState(value, delay)

Debounce the [value] for [delay] (in ms)

```js
import * as React from 'react'
import useDebouncedState from '@anissoft/react-hooks/useDebouncedState'

const Example = ({ initial }) => {
  const [value, setValue] = useState(initial)
  const [debouncedValue, setDebouncedValue] = useDebouncedState(initial, 300)

  const handleChange = e => {
    setValue(e.target.value)
    setDebouncedValue(e.target.value)
  }

  return (
    <div>
      <input onChange={handleChange} />
      <p>Value: {value}</p>
      <p>DebouncedValue: {debouncedValue}</p>
    </div>
  )
}
```

### - useThrottledState(value, delay)

Throttle the [value] for [delay] (in ms)

```js
import * as React from 'react'
import useThrottledState from '@anissoft/react-hooks/useThrottledState'

export default ({ initial }) => {
  const [value, setValue] = useState(initial)
  const [throttledValue, setThrottledValue] = useThrottledState(initial, 300)

  const handleChange = e => {
    setValue(e.target.value)
    setThrottledValue(e.target.value)
  }

  return (
    <div>
      <input onChange={handleChange} />
      <p>Value: {value}</p>
      <p>ThrottledValue: {throttledValue}</p>
    </div>
  )
}
```