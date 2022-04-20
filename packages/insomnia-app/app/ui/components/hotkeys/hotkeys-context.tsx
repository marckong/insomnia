import { EventEmitter } from 'events';
import React, { createContext, FunctionComponent, PropsWithChildren, useCallback, useEffect, useMemo } from 'react';

import { pressedHotKey } from '../../../common/hotkeys-listener';

interface UseHotKeysContext {
    sendHotkeyEvent(command: string, condition: string): void;
    checkIfHotKeyPressed(e: KeyboardEvent): any;
}
export const HotKeysContext = createContext<UseHotKeysContext>({
  sendHotkeyEvent: () => {},
  checkIfHotKeyPressed: () => {},
});

type Props = PropsWithChildren<{
    keyMap: [any, Function][];
}>;

export const HOTKEY_EVENT_TAG = 'HOTKEY_EVENT_TAG';
export const HotKeysProvider: FunctionComponent<Props> = ({ keyMap, children }) => {
  const hotkeyEvent = useMemo(() => new EventEmitter(), []);

  const sendHotkeyEvent = useCallback((hotkeyId: string, targetItentifier: string) => {
    hotkeyEvent.emit(HOTKEY_EVENT_TAG, { hotkeyId, targetItentifier });
  }, [hotkeyEvent]);

  const checkIfHotKeyPressed = useCallback(async (e: KeyboardEvent) => {
    for (const [definition] of keyMap) {
      const pressed = await pressedHotKey(e, definition);
      if (pressed) {
        return definition;
      }
    }
  }, [keyMap]);

  useEffect(() => {
    const listener = e => {
      console.log(e);
      const keyDefinition = keyMap.find(key => (key[0].id === e.hotkeyId && !key[0].excludes.includes(e.targetItentifier)));
      if (keyDefinition) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_id, callback] = keyDefinition;
        callback?.();
      }
    };

    hotkeyEvent.on(HOTKEY_EVENT_TAG, listener);

    return () => {
      hotkeyEvent.off(HOTKEY_EVENT_TAG, listener);
    };
  }, [hotkeyEvent, keyMap]);

  return (
    <HotKeysContext.Provider value={{ sendHotkeyEvent, checkIfHotKeyPressed }}>{children}</HotKeysContext.Provider>
  );
};
