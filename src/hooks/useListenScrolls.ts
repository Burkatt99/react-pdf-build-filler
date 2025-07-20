import React from "react";

import { SCROLL_KEYS } from "@/constants/types";

interface IListenScrollsResult {
  listenScrolls: () => void;
  removeListenScrolls: () => void;
}

interface IUseListenScrolls {
  callback: (e: any) => void;
  listenScrollsContainer?: Element;
}

export const useListenScrolls = ({
  callback,
  listenScrollsContainer,
}: IUseListenScrolls): IListenScrollsResult => {
  const preventDefaultForScrollKeys = React.useCallback(
    (e: any) => {
      if (SCROLL_KEYS.includes(e.key)) {
        callback(e);
      }
    },
    [callback],
  );

  const listenScrolls = React.useCallback(() => {
    const wheelEvent = "onwheel" in document ? "wheel" : "mousewheel";
    const container =
      listenScrollsContainer ??
      (document?.querySelector("#root") ||
        document?.querySelector("#__next") ||
        window);

    container.addEventListener("scroll", callback);
    container.addEventListener("DOMMouseScroll", callback, false); // older FF
    container.addEventListener(wheelEvent, callback, { passive: false }); // modern desktop
    container.addEventListener("touchmove", callback, { passive: false }); // mobile
    container.addEventListener("keydown", preventDefaultForScrollKeys, false);
  }, [preventDefaultForScrollKeys, callback]);

  const removeListenScrolls = React.useCallback(() => {
    const wheelEvent = "onwheel" in document ? "wheel" : "mousewheel";
    const container =
      listenScrollsContainer ?? (document?.querySelector("#root") || window);

    container.removeEventListener("scroll", callback);
    container.removeEventListener("DOMMouseScroll", callback, false);
    container.removeEventListener(wheelEvent, callback);
    container.removeEventListener("touchmove", callback);
    container.removeEventListener(
      "keydown",
      preventDefaultForScrollKeys,
      false,
    );
  }, [preventDefaultForScrollKeys, callback]);

  return {
    listenScrolls,
    removeListenScrolls,
  };
};
