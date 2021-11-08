import React from 'react';
import { Meta, Story } from '@storybook/react';

import { clearLogs, logs, setLevel } from '../../packages/console/src/index'

export default {
  title: 'cookies',
} as Meta;

(window as any).setLevel = setLevel;
(window as any).clearLogs = clearLogs;
(window as any).logs = logs;

export const Sandbox: Story<any> = (({ }) => {
  React.useEffect(() => {
    setTimeout(() => {
      Promise.reject('holla');
    }, 5000)
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

    </div>
  );
}).bind({});

Sandbox.args = {

};
