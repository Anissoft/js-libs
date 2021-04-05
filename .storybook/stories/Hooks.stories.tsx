import React from 'react';
import { Story, Meta } from '@storybook/react';
import Modal, { ModalProps } from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { useSharedState, SharedStateProvider } from '../../packages/react-hooks/src/useSharedState'

export default {
  title: 'react-hooks/useSharedState',
} as Meta;

const MyModal = ({ modalName, ...props }: { modalName: string } & Partial<ModalProps>) => {
  const [{ open, children }, setModalState] = useSharedState(modalName, {
    open: false,
    children: null,
  });

  const onCloseModal = React.useCallback(() => {
    setModalState((state) => ({ ...state, open: false }));
  }, [modalName]);

  return (
    <Modal {...props} open={open} onClose={onCloseModal}>
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
        <>{children}</>
      </Paper>
    </Modal>
  );
};

const Child = ({ modalName, modalContent }: { modalName: string; modalContent: string | JSX.Element }) => {
  const [modalState, setModalState] = useSharedState(modalName, { open: false, children: modalContent });
  const onOpenModal = React.useCallback(() => {
    setModalState({ children: modalContent, open: true });
  }, [modalName, modalContent]);

  React.useEffect(() => {
    if (modalContent !== modalState.children) {
      setModalState(state => ({ ...state, children: modalContent }));
    }
  }, [modalContent]);

  return (
    <Button onClick={onOpenModal}>
      open {modalName}
    </Button>
  );
}

export const WithProvider: Story<any> = (({ modal1Content, modal2Content }) => {
  return (
    <SharedStateProvider>
      <Paper style={{ width: 300 }}>
        <Grid container alignItems={'baseline'} justify={'space-around'} spacing={4}>
          <Grid item>
            <Child modalContent={<>{modal1Content}</>} modalName={'Modal1'} />
          </Grid>
          <Grid item>
            <Child modalContent={<>{modal2Content}</>} modalName={'Modal2'} />
          </Grid>
        </Grid>
      </Paper>
      <MyModal modalName={'Modal1'} />
      <MyModal modalName={'Modal2'} />
    </SharedStateProvider>
  );
}).bind({});

WithProvider.args = {
  modal1Content: "Hello from modal 1",
  modal2Content: "Hellow from modal 2"
};

export const WithoutProvider: Story<any> = (({ modal1Content, modal2Content }) => {
  return (
    <>
      <Paper style={{ width: 300 }}>
        <Grid container alignItems={'baseline'} justify={'space-around'} spacing={4}>
          <Grid item>
            <Child modalContent={modal1Content} modalName={'Modal1'} />
          </Grid>
          <Grid item>
            <Child modalContent={modal2Content} modalName={'Modal2'} />
          </Grid>
        </Grid>
      </Paper>
      <MyModal modalName={'Modal1'} />
      <MyModal modalName={'Modal2'} />
    </>
  );
}).bind({});

WithoutProvider.args = {
  modal1Content: "Hello from modal 1",
  modal2Content: "Hellow from modal 2"
};
