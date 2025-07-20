import React from "react";
import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";

import { ITabProps } from "../types";

import { tabClasses } from "./constants";

const Tab = (props: ITabProps) => {
  const {
    value,
    index = 0,
    onChange,
    label = "",
    tabKey,
    icon,
    iconPosition = "end",
    className,
    useKeyValue,
  } = props;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onChange?.(e, useKeyValue && tabKey ? tabKey : index);
    },
    [index, onChange, tabKey, useKeyValue],
  );

  const isSelected = useKeyValue ? value === tabKey : value === index;

  return (
    <button
      onClick={handleClick}
      role="tab"
      tabIndex={isSelected ? 0 : -1}
      aria-selected={isSelected}
      className={cn(className, tabClasses?.container, {
        [`${tabClasses?.container}--selected ${className}--selected`]:
          isSelected,
      })}
      style={{
        flexDirection:
          iconPosition === "start"
            ? "row-reverse"
            : iconPosition === "bottom"
              ? "column"
              : iconPosition === "top"
                ? "column-reverse"
                : "row",
      }}
    >
      {label}
      {icon}
    </button>
  );
};

export default appReactMemo(Tab);
