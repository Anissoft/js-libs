import React from 'react';
import { Story, Meta } from '@storybook/react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { ModalsProvider, useModal } from '../../packages/react-modals/src/react-modal'
import { Grid } from '@material-ui/core';

export default {
  title: 'react-modals/Modal',
} as Meta;

const Modal1 = ({ children, ...props }: any) => {
  return (
    <Modal
      open
      {...props}
    >
      <Paper
        style={{
          position: 'absolute',
          width: 100 + Math.round(Math.random() * 20) - 10,
          height: 100 + Math.round(Math.random() * 20) - 10,
          top: 50 + Math.round(Math.random() * 20) - 10,
          left: 50 + Math.round(Math.random() * 20) - 10,
          userSelect: 'none',
          backgroundColor: '#fff',
          border: '2px solid #000',
        }}
      >
        {children}
      </Paper>
    </Modal>
  );
};

const Child = ({ modalName, modalContent }: { modalName: string; modalContent: string | JSX.Element }) => {
  const toggleModal = useModal(modalName)

  return (
    <Button onClick={() => toggleModal(true, { onClose: () => toggleModal(false), children: modalContent })}>
      open {modalName}
    </Button>
  );
}

const Template: Story<any> = ({ modal1Content, modal2Content }) => {
  const modals = {
    modal1: Modal1,
    modal2: Modal1
  };

  return (
    <ModalsProvider modals={modals}>
      <Paper style={{ width: 300 }}>
        <Grid container alignItems={'baseline'} justify={'space-around'} spacing={4}>
          <Grid item>
            <Child modalContent={<>{modal1Content}</>} modalName={Object.keys(modals)[0]} />
          </Grid>
          <Grid item>
            <Child modalContent={<>{modal2Content}</>} modalName={Object.keys(modals)[1]} />
          </Grid>
        </Grid>
      </Paper>
    </ModalsProvider>
  );
};

export const Sandbox = Template.bind({});
Sandbox.args = {
  modal1Content: "Hello from modal 1",
  modal2Content: "Hellow from modal 2"
};
