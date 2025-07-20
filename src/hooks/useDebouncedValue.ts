import React, { useRef } from "react";

type TTimeoutId = ReturnType<typeof setTimeout>;

export function useDebouncedValue<T>(
  delay: number,
  initialData?: T,
): [T | undefined, (value: T, immidiate?: boolean) => void, boolean] {
  const [debouncedValue, setDebouncedValue] = React.useState<T | undefined>(
    initialData,
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const timeoutId = useRef<TTimeoutId>(null);

  const setValue = React.useCallback(
    (value: T, immidiate?: boolean) => {
      clearTimeout(timeoutId.current as TTimeoutId);
      if (immidiate) {
        setDebouncedValue(value);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        timeoutId.current = setTimeout(() => {
          setDebouncedValue(value);
          setIsLoading(false);
        }, delay);
      }
    },
    [delay],
  );

  React.useEffect(() => {
    return () => clearTimeout(timeoutId.current as TTimeoutId);
  }, []);

  return [debouncedValue, setValue, isLoading];
}

export default useDebouncedValue;
