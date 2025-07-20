import React from "react";

interface IUseOnclickOutsideConfig {
  eventTypes?: string[];
  ignoreClass?: string | string[];
}

type IUseOnclickOutsideResult = [
  HTMLElement | null,
  React.RefCallback<HTMLElement>,
];

const checkClass = (el: HTMLElement, cl: string): boolean => {
  return el.classList?.contains(cl);
};
const hasIgnoreClass = (e: any, ignoreClass: string | string[]): boolean => {
  let el = e.target || e;

  while (el) {
    if (Array.isArray(ignoreClass)) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      if (ignoreClass.some((c) => checkClass(el, c))) {
        return true;
      }
    } else if (checkClass(el, ignoreClass)) {
      return true;
    }

    el = el.parentElement;
  }

  return false;
};

export const useOnclickOutside = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (e: any) => void,
  {
    ignoreClass = [],
    eventTypes = ["mousedown", "touchstart"],
  }: IUseOnclickOutsideConfig = {},
): IUseOnclickOutsideResult => {
  const [element, setElement] = React.useState<HTMLElement | null>(null);

  const handler = React.useCallback(
    (e: any) => {
      if (!hasIgnoreClass(e, ignoreClass) && !element?.contains(e.target)) {
        callback(e);
      }
    },
    [ignoreClass, callback],
  );

  React.useEffect(() => {
    eventTypes.forEach((type) => document.addEventListener(type, handler));

    return () => {
      eventTypes.forEach((type) => document.removeEventListener(type, handler));
    };
  }, [eventTypes, handler]);

  const onMountRef = React.useCallback((node: HTMLElement) => {
    if (node) {
      setElement(node);
    }
  }, []);

  return [element, onMountRef];
};
