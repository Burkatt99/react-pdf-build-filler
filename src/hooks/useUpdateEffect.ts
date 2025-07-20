import React from "react";

export const useUpdateEffect = (
  effect: React.EffectCallback,
  deps: React.DependencyList,
): void => {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    if (isMounted.current) {
      return effect();
    }
    isMounted.current = true;
  }, deps);
};
