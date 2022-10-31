# React Events

Use this if you want to send custom events or messages from one React component to another, without lifting state or using refs.

## Installation

Just run [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @anissoft/react-events
```

## Usage

Just wrap your application in <CustomEventScope>:

```js
import React from "react";
import ReactDOM from "react-dom";
import { CustomEventScope } from "@anissoft/react-events";

/* ... */

ReactDOM.render(
  <CustomEventScope>
    <App />
  </CustomEventScope>,
  root
);
```

You can add event listener with hooks _useAddCustomEventListener_ or _useCusomEventListener_:

```js
import { useAddCustomEventListener } from "@anissoft/react-events";

function Component() {
  const addCustomeEventListener = useAddCustomEventListener();

  React.useEffect(() => {
    const removeEventListener = addCustomeEventListener("EventName", function listener(payload) {
      console.log(paylaod);
    });
  }, [...depsArray]);

  //...
}
```

or it's equivalent:

```js
import { useCustomEventListener } from "@anissoft/react-events";

function Component() {
  useCustomEventListener(
    "EventName",
    function listener(payload) {
      console.log(paylaod);
    },
    [...depsArray]
  );

  //...
}
```

To dispatch event - use hook _useDispatchCustomEvent_:

```js
import { useDispatchCustomEvent } from "@anissoft/react-events";

function Component() {
  const dispatchCustomeEvent = useDispatchCustomEvent();

  React.useEffect(() => {
    dispatchCustomeEvent("EventName", { data: "Some string" });
  }, []);
  //...
}
```

If you are using nested CustomScopes, you can isolate some of them - just pass prop _isolate=true_:

```js
  <CustomEventScope>
    {/* no events from child Scope will be fired in parent Scope  */}
     <CustomEventScope isolate>
     </CustomEventScope>
  </CustomEventScope>,
```

## Additional API

- _addGlobalEventListener_ - add event listener outside of React application;
- _removeGlobalEventListener_ - remove global event listener outside of React application;
- _dispatchGlobalEvent_ - fire event on global level;
