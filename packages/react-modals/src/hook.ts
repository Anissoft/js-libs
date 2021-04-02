import { useContext, useCallback } from 'react';

import { context } from './context'

export const useModal = (modalName: string) => {
  const toggleModal = useContext(context);

  if (!toggleModal) {
    throw new Error('You should wrap your component in <ModalsProvider /> first')
  }

  return useCallback((opened: boolean, props: Record<string, any> = {}) => {
    toggleModal(modalName, opened, props);
  }, [modalName, toggleModal]);
}