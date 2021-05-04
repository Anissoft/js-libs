import React from 'react';

export const useKeyboard = (
  shortcut: (presseedKeys: string[], amount: number) => void,
  deps?: React.DependencyList,
) => {
  const composition = React.useRef(new Set<string>([]));
  const pressedKeys = React.useRef(0);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      composition.current.add(event.code);
      composition.current.add(event.key);
      pressedKeys.current = pressedKeys.current + 1;
      shortcut(Array.from(composition.current), pressedKeys.current);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      composition.current.delete(event.code);
      composition.current.delete(event.key);
      pressedKeys.current = pressedKeys.current > 0 ? pressedKeys.current - 1 : 0;
      shortcut(Array.from(composition.current), pressedKeys.current);
    };

    const clear = () => {
      composition.current.clear();
      pressedKeys.current = 0;
      shortcut(Array.from(composition.current), pressedKeys.current);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('blur', clear);
    document.addEventListener('focusin', clear);
    document.addEventListener('pointerout', clear);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('blur', clear);
      document.removeEventListener('focusin', clear);
      document.removeEventListener('pointerout', clear);
    };
  }, deps);
};

export default useKeyboard;
