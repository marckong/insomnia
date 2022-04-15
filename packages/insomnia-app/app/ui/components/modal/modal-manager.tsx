import React, { ComponentType, useContext, useEffect, useState } from 'react';

import { MODAL_TRIGGER, ModalContext } from './modal-context';

export interface ModalComposition {
  component: ComponentType<any>;
  props?: any;
}

export const ModalManager = () => {
  const [composition, setComposition] = useState<ModalComposition | null>();

  const { $onModal } = useContext(ModalContext);

  useEffect(() => {
    const handler = (e: ModalComposition | null) => {
      setComposition(e);
    };

    $onModal.on(MODAL_TRIGGER, handler);

    return () => {
      $onModal.off(MODAL_TRIGGER, handler);
    };
  }, [$onModal]);

  useEffect(() => {
    const body = document.body;
    const onEscapePressed = (event: KeyboardEvent) => {
      const { code } = event;
      if (code !== 'Escape') {
        return;
      }

      setComposition(null);
    };
    if (composition) {
      document.body.addEventListener('keydown', onEscapePressed);
    }

    return () => {
      body.removeEventListener('keydown', onEscapePressed);
    };
  }, [composition]);

  if (!composition) {
    return null;
  }

  const { component: ModalInstance, props: modalProps } = composition;
  return <ModalInstance {...modalProps} />;
};
