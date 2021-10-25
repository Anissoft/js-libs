import React from 'react';
import { Meta, Story } from '@storybook/react';

import { useDocumentCookies } from '../../packages/react-hooks/src/useDocumentCookies'

export default {
  title: 'cookies',
} as Meta;

export const Sandbox: Story<any> = (({ }) => {
  const [cookies, setCookie] = useDocumentCookies();

  console.log(cookies, { setCookie });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

    </div>
  );
}).bind({});

Sandbox.args = {

};
