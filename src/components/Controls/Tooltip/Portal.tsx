import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { appReactMemo } from "@/hocs/appReactMemo";

interface PortalProps {
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLElement>;
  scrollPosition?: number;
}

const Portal = ({ children, targetRef, scrollPosition }: PortalProps) => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  useEffect(() => {
    if (targetRef.current && portalContainer) {
      const rect = targetRef.current.getBoundingClientRect();

      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [targetRef, portalContainer, scrollPosition]);

  if (!portalContainer) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>,
    portalContainer,
  );
};

export default appReactMemo(Portal);
