import { EventEmitter } from 'events';
import { KeyCombination } from 'insomnia-common';
import React, { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { areSameKeyCombinations, getPlatformKeyCombinations, HotKeyDefinition, hotKeyRefs } from '../../../common/hotkeys';
import * as models from '../../../models';
import { Settings } from '../../../models/settings';

const HOTKEY_EVENT_TAG = 'HOTKEY_EVENT_TAG';
const hotkeyEvent = new EventEmitter();
interface UseHotKeysContext {
    sendHotkeyEvent(command: string, condition: string): void;
    checkIfHotKeyPressed(e: KeyboardEvent, definitions: Record<string, HotKeyDefinition>): Promise<any>;

  }
const HotKeysContext = createContext<UseHotKeysContext>({
  sendHotkeyEvent: () => {},
  checkIfHotKeyPressed: async () => {},
});

interface Props {
  children: ReactNode;
}

export function useHotKeysListener<T extends HTMLElement>(target: T, allowOnlyGlobal = false, origin = 'local'): void {
  const { sendHotkeyEvent, checkIfHotKeyPressed } = useContext(HotKeysContext);

  useEffect(() => {
    const listener = async (e: KeyboardEvent) => {
      const result = await checkIfHotKeyPressed(e, hotKeyRefs);
      if (result) {
        sendHotkeyEvent(result.id, allowOnlyGlobal && e.target === e.currentTarget ? 'global' : origin);
      }
    };
    target.addEventListener('keydown', listener);
    return () => target.removeEventListener('keydown', listener);
  }, [target, sendHotkeyEvent, checkIfHotKeyPressed, allowOnlyGlobal, origin]);
}

// TODO: define return type and event type
export function useSubscriptionToHotKeys(handler: (event: any) => void) {
  useEffect(() => {
    hotkeyEvent.on(HOTKEY_EVENT_TAG, handler);

    return () => {
      hotkeyEvent.off(HOTKEY_EVENT_TAG, handler);
    };
  }, [handler]);
}

function useHotKeysRegistry() {
  const [registry, setRegistry] = useState({});
  useEffect(() => {
    async function resolveModels() {
      const settingsResolved: Settings = await models.settings.getOrCreate();
      setRegistry(settingsResolved.hotKeyRegistry);
    }

    resolveModels();
  }, []);

  return registry;
}

export const HotKeysProvider: FunctionComponent<Props> = ({ children }) => {
  const registry = useHotKeysRegistry();
  const sendHotkeyEvent = useCallback((hotkeyId: string, targetItentifier: string) => {
    hotkeyEvent.emit(HOTKEY_EVENT_TAG, { hotkeyId, targetItentifier });
  }, []);

  const checkIfHotKeyPressed = useCallback((e: KeyboardEvent, definitions: Record<string, HotKeyDefinition>): any => {
    function pressedHotKey(event: KeyboardEvent, definition: HotKeyDefinition) {
      const pressedKeyComb: KeyCombination = {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey,
        // keyCode is deprecated. we may refactor this in the soon future
        keyCode: event.keyCode,
      };

      const keyCombList = getPlatformKeyCombinations(registry[definition.id]);
      for (const keyComb of keyCombList) {
        if (areSameKeyCombinations(pressedKeyComb, keyComb)) {
          return true;
        }
      }

      return false;
    }

    const pressed = Object.values(definitions).find(def => pressedHotKey(e, def));
    if (pressed) {
      return pressed;
    }

    return false;
  }, [registry]);

  return (
    <HotKeysContext.Provider value={{ sendHotkeyEvent, checkIfHotKeyPressed }}>{children}</HotKeysContext.Provider>
  );
};
