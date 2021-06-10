import React from 'react';
import { ObjectWithSubscription } from './utils/objectWithSubscription';

const state = new ObjectWithSubscription({
  composition: [] as string[],
  pressedKeys: 0,
});

const onKeyDown = (event: KeyboardEvent) => {
  if (event.repeat) {
    return;
  }
  const composition = new Set(state.value.composition);
  composition.add(event.code);
  composition.add(event.key);
  state.set({
    composition: Array.from(composition),
    pressedKeys: state.value.pressedKeys + 1,
  });
};

const onKeyUp = (event: KeyboardEvent) => {
  const composition = new Set(state.value.composition);
  composition.delete(event.code);
  composition.delete(event.key);
  state.set({
    composition: Array.from(composition),
    pressedKeys: state.value.pressedKeys > 0 ? state.value.pressedKeys - 1 : 0,
  });
};

const clear = () => {
  state.set({
    composition: [],
    pressedKeys: 0
  });
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('blur', clear);
// document.addEventListener('focusin', clear);
document.addEventListener('focus', clear);
// document.addEventListener('pointerout', clear);

export const useKeyboard = (
  shortcut: (composition: string[], pressedKeys: number) => void,
  deps?: React.DependencyList,
) => {
  React.useEffect(() => {
    const { unsubscribe } = state.subscribe(({ pressedKeys, composition }) => {
      shortcut(composition, pressedKeys)
    });
    return () => {
      unsubscribe();
    };
  }, deps);
};

export default useKeyboard;
