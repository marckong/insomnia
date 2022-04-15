import { EventEmitter } from 'events';
import React, { createContext, FunctionComponent, ReactNode, useCallback } from 'react';

import { ModalComposition } from './modal-manager';

interface UseModalContext {
    $onModal: EventEmitter;
    showModal(composition: ModalComposition): void;
    hideModal(): void;
}
const $onModal = new EventEmitter();
export const ModalContext = createContext<UseModalContext>({
  $onModal,
  showModal: () => {},
  hideModal: () => {},
});
const { Provider } = ModalContext;

interface Props {
    children: ReactNode;
}
export const MODAL_TRIGGER = 'MODAL_TRIGGER';
export const ModalProvider: FunctionComponent<Props> = ({ children }) => {
  const showModal = useCallback((composition: ModalComposition) => {
    $onModal.emit(MODAL_TRIGGER, composition);
  }, []);

  const hideModal = useCallback(() => {
    $onModal.emit(MODAL_TRIGGER, null);
  }, []);

  return (
    <Provider value={{ $onModal, showModal, hideModal }}>{children}</Provider>
  );
};
