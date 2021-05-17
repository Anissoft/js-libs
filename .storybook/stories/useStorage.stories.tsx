import React from 'react';
import { Story, Meta } from '@storybook/react';
import Grid from '@material-ui/core/Grid';
import { Input, Typography } from '@material-ui/core';

import { useLocalStorage, useSessionStorage } from '../../packages/react-hooks/src/useStorage'

export default {
  title: 'react-hooks/useStorage',
} as Meta;

const ChildLS = ({ name, defaultValue }: { name: string; defaultValue?: string }) => {
  const [value, setValue] = useLocalStorage(name, defaultValue);

  return (
    <Grid item container key={name} spacing={2} alignItems="center">
      <Grid item style={{ width: 400 }}>
        <Input
          value={value || ''}
          fullWidth
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </Grid>
      <Grid item >
        <Typography>"{name}": {value}</Typography>
      </Grid>
    </Grid >
  )
}

const ChildSS = ({ name, defaultValue }: { name: string; defaultValue?: string }) => {
  const [value, setValue] = useSessionStorage(name, defaultValue);

  return (
    <Grid item container key={name} spacing={2} alignItems="center">
      <Grid item style={{ width: 400 }}>
        <Input
          value={value || ''}
          fullWidth
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </Grid>
      <Grid item >
        <Typography>"{name}": {value}</Typography>
      </Grid>
    </Grid >
  )
}

export const UseLocalStorage: Story<any> = (({ }) => {

  return (
    <Grid item container xs={12} justify="flex-start" alignItems="center" spacing={2}>
      <ChildLS name={'key'} />
      <ChildLS name={'key'} defaultValue={'value from second child'} />
      <ChildLS name={'key'} defaultValue={'value from third child'} />
    </Grid>
  );
}).bind({});

UseLocalStorage.args = {

};

export const UseSessionStorage: Story<any> = (({ }) => {

  return (
    <Grid item container xs={12} justify="flex-start" alignItems="center" spacing={2}>
      <ChildSS name={'key'} />
      <ChildSS name={'key'} defaultValue={'value from second child'} />
      <ChildSS name={'key'} defaultValue={'value from third child'} />
    </Grid>
  );
}).bind({});

UseSessionStorage.args = {

};
