import React from "react";
import cn from "classnames";

import "../styles.scss";

import Button from "@/components/Button";
import { appReactMemo } from "@/hocs/appReactMemo";

import { popoverMenuClasses } from "../../PopoverMenu/constants";

interface IMenuButton {
  onClick: (item: number) => void;
  children: React.ReactNode;
  number: number;
  isSelected: boolean;
  className?: string;
}

const MenuButton = (props: IMenuButton) => {
  const { children, number, onClick, isSelected, className } = props;
  const handleClick = React.useCallback(() => {
    onClick(number);
  }, [number, onClick]);

  return (
    <Button
      width="100%"
      onClick={handleClick}
      className={cn(className, {
        [`${popoverMenuClasses.button}--selected`]: isSelected,
      })}
    >
      {children}
    </Button>
  );
};

export default appReactMemo(MenuButton);
