import React from 'react';
import { Story, Meta } from '@storybook/react';
import Grid from '@material-ui/core/Grid';
// import { Typography } from '@material-ui/core';

import { CustomEventScope, useAddCustomEventListener, useCustomEventListener } from '../../packages/react-events/src/react-events'

export default {
  title: 'sandbox',
} as Meta;

const Child2 = ({ event }: { event: string }) => {
  const subscribe = useAddCustomEventListener();

  React.useEffect(() => {
    if (event === 'second2') {
      const unsubscribe = subscribe(event, console.log);
      setTimeout(unsubscribe, 5000);
    }
  }, []);

  return (<button>Click me</button>)
}

const Child1 = ({ children, name }: React.PropsWithChildren<{ name: string }>) => {
  return (
    <CustomEventScope>
      <Grid item container xs={12} justify="flex-start" alignItems="center" spacing={2}>
        {children}
      </Grid>
    </CustomEventScope>
  )
}

export const Parent1: Story<any> = (({ }) => {
  return (
    <CustomEventScope>
      <Child2 event={'first'} />
      <Child1 name={'2'} >
        <Child2 event={'second'} />
        <Child2 event={'second2'} />
      </Child1>
    </CustomEventScope>
  );
}).bind({});

Parent1.args = {

};
