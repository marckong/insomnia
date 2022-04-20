import React, { FunctionComponent, PropsWithChildren, useContext, useEffect } from 'react';

import { HotKeysContext } from './hotkeys/hotkeys-context';

type Props = PropsWithChildren<{}>;

export const Keybinder: FunctionComponent<Props> = ({ children }) => {
  const { sendHotkeyEvent, checkIfHotKeyPressed } = useContext(HotKeysContext);
  useEffect(() => {
    const body = document.body;
    const listener = async (e: KeyboardEvent) => {
      const result = await checkIfHotKeyPressed(e);
      if (result) {
        sendHotkeyEvent(result.id, 'global');
      }
    };
    body.addEventListener('keydown', listener);
    return () => body.removeEventListener('keydown', listener);
  }, [sendHotkeyEvent, checkIfHotKeyPressed]);

  return <>{children}</>;
};
