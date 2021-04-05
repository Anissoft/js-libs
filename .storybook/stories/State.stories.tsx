import React from 'react';
import { Story, Meta } from '@storybook/react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';

import { useStateObject } from '../../packages/state-react/src'

export default {
  title: 'state-react/Sandbox',
} as Meta;

export const Sandbox: Story<any> = (({ key31, key32, key1, key2 }: any) => {
  const state = useStateObject({ key1, key2, key3: { key31, key32 } });

  React.useEffect(() => {
    Object.assign(state.value, { key1, key2, key3: { key31, key32 } });
  }, [key31, key32, key1, key2]);

  return (
    <>
      <Paper style={{ width: 300, padding: 16 }} >
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <pre>
              {JSON.stringify(state.value, null, 4)}
            </pre>
          </Grid>
          <Grid item>
            <Input value={state.value.key1} onChange={(event) => { state.value.key1 = event.target.value; }} />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}).bind({});

Sandbox.args = {
  key1: 'value1',
  key2: 'value2',
  key31: 'value3.1',
  key32: 'value3.2',
};
