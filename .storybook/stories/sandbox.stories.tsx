import React from 'react';
import { Meta, Story } from '@storybook/react';

import {
  CustomEventScope,
  addGlobalEventListener,
  dispatchGlobalEvent,
  useCustomEventListener,
  useDispatchCustomEvent
} from '../../packages/react-events/src/react-events'

export default {
  title: 'sandbox',
} as Meta;

const Child2 = ({ name }: { name: string }) => {
  // useCustomEventListener('global_click', (evt) => console.log({ got: name, evt }));
  useCustomEventListener('event', (evt) => console.log(`${name} got "event" event`, evt));
  const dispatchCustomEvent = useDispatchCustomEvent();

  return (<div>
    <button onClick={(event) => dispatchCustomEvent('event', { from: name })}>Dispatch event from "{name}" click</button>
  </div>)
}

export const Parent1: Story<any> = (({ }) => {
  React.useEffect(() => {
    console.log({ dispatchGlobalEvent, addGlobalEventListener })
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <CustomEventScope >
        <Child2 name={'top'} />
        <CustomEventScope >
          <Child2 name={'second'} />
          <CustomEventScope >
            <Child2 name={'third'} />
            <CustomEventScope isolate>
              <Child2 name={'forth'} />
            </CustomEventScope>
          </CustomEventScope>
        </CustomEventScope>
      </CustomEventScope>
    </div>
  );
}).bind({});

Parent1.args = {

};
