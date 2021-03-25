# React Hooks

Just bunch of hooks, that I commonly use in my code

## Installation

Just run [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @anissoft/react-hooks
```

### - useDebouncedState(value, delay)

Debounce the [value] for [delay] (in ms)

```js
import * as React from 'react'
import useDebouncedState from '@anissoft/react-hooks/useDebouncedState'

export default ({ initial }) => {
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
      <If
        condition={mounted}
        then={() => <p>Component just renders</p>}
        else={() => <p>Component was rendered before</p>}
      />
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