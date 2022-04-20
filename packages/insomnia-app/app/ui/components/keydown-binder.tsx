import React, { FunctionComponent, PropsWithChildren, useContext, useEffect, useRef } from 'react';

import { HotKeysContext } from './hotkeys/hotkeys-context';

type Props = PropsWithChildren<{
  stopEventBubbling?: boolean;
  onKeydown?: (...args: any[]) => any;
  onKeyup?: (...args: any[]) => any;
  disabled?: boolean;
  scoped?: boolean;
  stopMetaPropagation?: boolean;
  pathId?: string;
}>;

export const KeydownBinder: FunctionComponent<Props> = ({
  children,
  disabled,
  onKeydown,
  onKeyup,
  pathId,
  stopEventBubbling,
}) => {
  const { checkIfHotKeyPressed, sendHotkeyEvent } = useContext(HotKeysContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const listener = async (e: KeyboardEvent) => {
      e.preventDefault();
      if (stopEventBubbling) {
        e.stopPropagation();
      }

      const result = await checkIfHotKeyPressed(e);
      if (result) {
        sendHotkeyEvent(result.id, pathId);
      }

      onKeydown?.(e);
    };

    if (!disabled && Boolean(onKeydown)) {
      el?.addEventListener('keydown', listener);
    }

    return () => {
      el?.removeEventListener('keydown', listener);
    };

  }, [checkIfHotKeyPressed, disabled, onKeydown, pathId, sendHotkeyEvent, stopEventBubbling]);

  useEffect(() => {
    const el = ref.current;
    const listener = async (e: KeyboardEvent) => {
      e.preventDefault();
      if (stopEventBubbling) {
        e.stopPropagation();
      }

      const result = await checkIfHotKeyPressed(e);

      if (result) {
        sendHotkeyEvent(result.id, pathId);
      }

      onKeyup?.(e);
    };

    if (!disabled && Boolean(onKeyup)) {
      el?.addEventListener('keyup', listener);
    }

    return () => {
      el?.removeEventListener('keyup', listener);
    };

  }, [checkIfHotKeyPressed, disabled, onKeyup, pathId, sendHotkeyEvent, stopEventBubbling]);

  return <div ref={ref}>{children}</div>;
};
