# React Hooks

Just bunch of hooks, that I commonly use in my code

## Installation

Just run [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @anissoft/react-hooks
```

## React lifecycle

### - useMounted()

Shortway for 'didMount' property

```js
import React from 'react'
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

## Browser api and events 

### - useQueryParameter(parameterName [, defaultValue])

Allows to use querystring parameter from url as State in your component.  This hook doesn't require react-router or any similar packages

```js
import React from 'react';
import useQueryParameter from '@anissoft/react-hooks/useQueryParameter';

export const Example = (({ selectedPage }) => {
  const [test, setTest] = useQueryParameter('test', 'default-value');
  // if parameter ?test= doesn't present in url, it will be added with provided default value
  // otherwise, default value will be ignored, and current one will be in use

  React.useEffect(() => {
    // parameter changes in url will lead to component update
    console.log(`Parameter 'test' was changed to ${test}`);
  }, [test]);

  
  const [page, setPage] = useQueryParameter('page');
  // if parameter ?page= doesn't present in url, and no default value provided 
  // page will be equals ''

  React.useEffect(() => {
    if (page !== selectedPage) {
      setPage(selectedPage);
    }
  }, [selectedPage]);

  // ...
});
```

### - useTabFocus({ onBlur, onFocus } [, deps])

Will subscribe corresponding callbacks for onblur and onfocus window events (eg. if user switched tab)

```js
import React from 'react';
import useTabFocus from '@anissoft/react-hooks/useTabFocus';

const Example = () => {
  useTabFocus({
    onBlur: () => {
      console.log('User has left tab');
    },
    onFocus: () => {
      console.log('User opened tab back');
    }
  }, []);
  // ...
}
```

### - useKeyboard(callback [, deps])

Will execute callback on keydown events with all pressed keys and keycodes at this moment

```js
import React from 'react';
import useKeyboard from '@anissoft/react-hooks/useKeyboard';

const Example = () => {
  const [pressedKeys, setPressedKeys] = React.useState<string[]>([]);
  const [pressedAmount, setPressedAMount] = React.useState<number>(0);

  useKeyboard((keys, amount) => {
    setPressedKeys(keys);
    setPressedAMount(amount)
  }, []);

  return (
    <div>
      <p>Total key pressed: {pressedAmount}</p>
      <ul>
      {pressedKeys.map(key => <li>{key}</li>)}
      </ul>
    </div>
  )
}
```

## React state managemenet

### - useLocalStorage(key [,defaultState]) and useSessionStorage(key [,defaultState])

Just like regular React.useState(), but will also sync state with corresponsing value in localStorage or sessionStorage. When value in storage will be changed somewere else in application - component will also update it's state;

```js
import React from 'react';
import { useLocalStorage } from '@anissoft/react-hooks/useStorage';

const Example = () => {
  const [value, setValue] = useLocalStorage('key');

  return <input value={value} onChange={(event) => setValue(event.target.value)}/>
}
```

You can also specify the default value:

```js
const Example = () => {
  const [value, setValue] = useSessionStorage('key', 'default string');

  React.useEffect(() => {
    console.log(sessionStorage.getItem('key') === 'default string'); // true
  }, []);

  // ...
}
```

### - useSharedState(key [,defaultState])

Allows you to access state and setState method with this hook in any place at your application by uniq stateId

```js
import React from 'react';
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

Returns instance of Set, witch triggers component update on its changes (.add, .delete and .clear methods)

```js
import React from 'react'
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
import React from 'react'
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
import React from 'react'
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