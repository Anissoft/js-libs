import * as React from 'react';

export function useTabFocus(
  effects?: { onFocus?: React.EffectCallback; onBlur?: React.EffectCallback },
  deps: React.DependencyList = [],
) {
  const [focused, setFocused] = React.useState(!document.hidden);

  React.useEffect(() => {
    const onFocus = () => {
      setFocused(true);
      if (effects && effects.onFocus) {
        effects.onFocus();
      }
    };

    const onBlur = () => {
      setFocused(false);
      if (effects && effects.onBlur) {
        effects.onBlur();
      }
    }

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus)
      window.removeEventListener("blur", onBlur)
    }
  }, deps);

  return focused;
}

export default useTabFocus;