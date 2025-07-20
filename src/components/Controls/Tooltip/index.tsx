import React from "react";
import cn from "classnames";
import classNames from "classnames";

import "./styles.scss";

import useTooltip from "./hooks/useTooltip";

import { tooltipClasses } from "./constants";
import Portal from "./Portal";
import { TooltipClasses } from "./types";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  defaultPlacement?: "top" | "bottom" | "left" | "right";
  trigger?: "hover" | "click";
  open?: boolean;
  classes?: TooltipClasses;
  scrollPosition?: number;
  onOpen?: () => void;
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const {
    content,
    children,
    open,
    classes,
    onOpen,
    scrollPosition,
    defaultPlacement = "bottom",
    trigger = "hover",
  } = props;

  const {
    targetRef,
    tooltipRef,
    placement,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    triggerRef,
    visible,
    stylePosition,
  } = useTooltip({ defaultPlacement, open, onOpen, trigger });

  return (
    <div
      ref={targetRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(tooltipClasses.wrapper, classes?.wrapper)}
    >
      <div ref={triggerRef} onClick={handleClick}>
        {children}
      </div>
      <Portal
        targetRef={targetRef as React.RefObject<HTMLElement>}
        scrollPosition={scrollPosition}
      >
        <div
          ref={tooltipRef}
          className={classNames(tooltipClasses.content, classes?.content, {
            [`${tooltipClasses.content}--visible ${classes?.content}--visible`]:
              visible,
            [`${tooltipClasses.content}--top ${classes?.content}--top`]:
              placement === "top",
            [`${tooltipClasses.content}--right ${classes?.content}--right`]:
              placement === "right",
            [`${tooltipClasses.content}--bottom ${classes?.content}--bottom`]:
              placement === "bottom",
            [`${tooltipClasses.content}--left ${classes?.content}--left`]:
              placement === "left",
          })}
          style={{
            top: stylePosition.top,
            left: stylePosition.left,
            right: stylePosition.right,
            transform: stylePosition.transform,
          }}
        >
          {content}
          <div
            className={cn(tooltipClasses.arrow, classes?.arrow, {
              [`${tooltipClasses.arrow}--top ${classes?.arrow}--top`]:
                placement === "top",
              [`${tooltipClasses.arrow}--right ${classes?.arrow}--right`]:
                placement === "right",
              [`${tooltipClasses.arrow}--bottom ${classes?.arrow}--bottom`]:
                placement === "bottom",
              [`${tooltipClasses.arrow}--left ${classes?.arrow}--left`]:
                placement === "left",
            })}
          />
        </div>
      </Portal>
      {/* )} */}
    </div>
  );
};

export default Tooltip;
