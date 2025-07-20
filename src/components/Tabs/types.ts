import React from "react";

export type TIconPosition = "top" | "bottom" | "start" | "end";
export interface ITabProps extends ITabs {
  index?: number;
  label?: string;
  icon?: string | React.ReactElement;
  iconPosition?: TIconPosition;
  useKeyValue?: boolean;
  tabKey?: string;
}

export interface ITabs {
  value?: string | number;
  onChange?: (_e: React.SyntheticEvent, newValue: string | number) => void;
  className?: string;
}

export type ITabsNamings = Partial<{
  container: string;
  root: string;
  scrollButton: string;
  scrollable: string;
  scrollerWrap: string;
  tabList: string;
}>;

export interface AdditionalProps {
  index: number;
  value?: string | number;
  onChange: (event: React.SyntheticEvent, value: string) => void;
  useKeyValue: boolean;
}

export interface ITabsProps extends ITabs {
  children?: React.ReactNode;
  scrollButtons?: boolean;
  useKeyValue?: boolean;
  classes?: ITabsNamings;
}

export type TScrollButton = "next" | "prev";
