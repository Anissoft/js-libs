import React from 'react';
import { openedModalsState, toggleView } from './types';

export const context = React.createContext<toggleView | null>(null);

export const ModalsProvider = ({
  children,
  modals
}: React.PropsWithChildren<{
  modals: Record<string, (props: any) => JSX.Element>;
}>) => {
  const [openedModals, setOpenedModals] = React.useState<openedModalsState>({});
  const toggleModal = React.useCallback<toggleView>((modalName, opened, props = {}) => {
    if (opened) {
      setOpenedModals(state => ({ ...state, [modalName]: props }));
    } else if (!!openedModals[modalName]) {
      const candidate = { ...openedModals };
      delete candidate[modalName];
      setOpenedModals(candidate);
    }
  }, []);

  return (
    <context.Provider value={toggleModal}>
      {children}
      {Object.entries(openedModals).map(([modalName, props]) => {
        const Component = modals[modalName];
        return <Component {...props} />
      })}
    </context.Provider>
  );
}