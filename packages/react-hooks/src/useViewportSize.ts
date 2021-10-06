import React from "react";

export function useViewportSize({ onResize }: { onResize?: (width: number, height: number) => void } = {}) {
  const [viewportSize, setSize] = React.useState({ width: window.innerWidth, heigth: window.innerHeight });

  React.useEffect(() => {
    const listener = () => {
      setSize({ width: window.innerWidth, heigth: window.innerHeight });
      if (onResize) {
        onResize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    }
  }, [onResize]);

  return viewportSize;
}
