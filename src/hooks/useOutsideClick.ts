import { useEffect } from "react";

type IUseOutsideClickProps = {
  cb: (e: MouseEvent) => void;
  element: HTMLElement | null;
  dependencies?: unknown[];
};

const useOutsideClick = (props: IUseOutsideClickProps): void => {
  const { cb, element, dependencies = [] } = props;
  let isMounted = true;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMounted && element?.contains(e.target as HTMLElement) === false) {
        cb(e);
      }
    };

    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      isMounted = false;
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [element, ...dependencies]);
};

export default useOutsideClick;
