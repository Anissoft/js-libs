import React from 'react';
import { Story, Meta } from '@storybook/react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { useQueryParameter } from '../../packages/react-hooks/src/useQueryParameter'
import { Typography } from '@material-ui/core';

export default {
  title: 'react-hooks/useQueryParameter',
} as Meta;

export const Example: Story<any> = (({ }) => {
  const [test, setTest] = useQueryParameter('test', 'default-value');

  return (
    <Grid item container xs={6} justify="space-between" alignItems="center">
      <Grid item><Typography>{test}</Typography></Grid>
      <Grid item><Button onClick={() => setTest(new Date().toISOString())}>change parameter</Button></Grid>
    </Grid>
  );
}).bind({});

Example.args = {

};
