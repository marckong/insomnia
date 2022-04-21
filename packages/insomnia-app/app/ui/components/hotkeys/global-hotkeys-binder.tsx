import React, { FunctionComponent, ReactNode, useCallback } from 'react';

import { useHotKeysListener, useSubscriptionToHotKeys } from './hotkeys-context';

interface Props {
  children: ReactNode;
}

export const GlobalHotKeysBinder: FunctionComponent<Props> = ({ children }) => {
  useHotKeysListener(document.body, true);

  const subscriber = useCallback((event: any) => {
    console.log('event', event);
    if (event.hotkeyId === 'environment_showEditor') {
      // showModal({
      //   component: WorkspaceEnvironmentsEditModalRe,
      //   props: {
      //     handleChangeEnvironment: () => {},
      //   },
      // });
    }
  }, []);

  useSubscriptionToHotKeys(subscriber);

  return <>{children}</>;
};
