import React from 'react';
import { Story, Meta } from '@storybook/react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

import { useEventScope, EventScopeProvider } from '../../packages/react-events/src/react-events'

export default {
  title: 'sandbox',
} as Meta;

const Child = () => {
  const scope = useEventScope();
  return (<button onClick={() => scope.dispatchEvent('event1', { bubbles: true, detail: { date: new Date() } })}>Click me</button>)
}

const Container = () => {
  return (
    <EventScopeProvider name={'EventScope2'}>
      <Grid item container xs={12} justify="flex-start" alignItems="center" spacing={2}>
        <Child />
      </Grid>
    </EventScopeProvider>
  )
}

export const EventScope1: Story<any> = (({ }) => {
  const { addEventListener } = useEventScope();
  const [state, setState] = React.useState('')

  React.useEffect(() => {
    addEventListener('event1', (event) => {
      setState(`${event.detail.date}`);
    });
  }, []);

  return (
    <EventScopeProvider name={'EventScope1'}>
      <Grid item container xs={12} justify="flex-start" alignItems="center" spacing={2}>
        <Container />
        <Typography variant="body1">{state}</Typography>
      </Grid>
    </EventScopeProvider>
  );
}).bind({});

EventScope1.args = {

};
