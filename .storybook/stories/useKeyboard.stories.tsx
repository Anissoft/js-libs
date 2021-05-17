import React from 'react';
import { Story, Meta } from '@storybook/react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

import { useKeyboard } from '../../packages/react-hooks/src/useKeyboard'

export default {
  title: 'react-hooks/useKeyboard',
} as Meta;

export const Example: Story<any> = (({ }) => {
  const [pressedKeys, setPressedKeys] = React.useState<string[]>([]);
  const [pressedAmount, setPressedAMount] = React.useState<number>(0);

  useKeyboard((keys, amount) => {
    setPressedKeys(keys);
    setPressedAMount(amount)
  }, []);

  return (
    <Grid item container xs={12} justify="flex-start" alignItems="center" spacing={2}>
      <Grid item><Typography>Total keys pressed: {pressedAmount}</Typography></Grid>
      {
        pressedKeys.map(key => (
          <Grid item key={key}>
            <Typography>{key}</Typography>
          </Grid>
        ))
      }
    </Grid>
  );
}).bind({});

Example.args = {

};
