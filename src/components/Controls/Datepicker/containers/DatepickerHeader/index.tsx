import React from "react";
import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";

import { datepickerClasses } from "../../constants";

interface IDatepickerHeader {
  children?: React.ReactNode;
  className?: string;
}

const DatepickerHeader = ({ children, className }: IDatepickerHeader) => {
  return (
    <div className={cn(datepickerClasses.header, className)}>{children}</div>
  );
};

export default appReactMemo(DatepickerHeader);
