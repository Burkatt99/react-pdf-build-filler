import React from "react";
import cn from "classnames";

import "./styles.scss";

import Button from "@/components/Button";
import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";

import YearsList from "../../components/YearsList";
import {
  PopoverMenuClasses,
  popoverMenuClasses,
} from "../../PopoverMenu/constants";

export interface IYearsMenu {
  yearsList: number[];
  onSelectYear: (year: number) => void;
  selectedYear: number;
  classes?: PopoverMenuClasses;
  onIncrementYears: () => void;
  onDecrementYears: () => void;
}

const YearsMenu = (props: IYearsMenu) => {
  const {
    yearsList,
    selectedYear,
    classes,
    onSelectYear,
    onIncrementYears,
    onDecrementYears,
  } = props;

  return (
    <div className={cn(popoverMenuClasses.yearsMenu, classes?.yearsMenu)}>
      <div
        className={cn(
          popoverMenuClasses.yearsMenuTitle,
          classes?.yearsMenuTitle,
        )}
      >
        <Button
          variant="icon"
          startIcon={<ICONS_MAP.ArrowLeftIcon />}
          onClick={onDecrementYears}
          className={cn(popoverMenuClasses.yearButton, classes?.yearButton)}
        />
        <div className={cn(popoverMenuClasses.yearTitle, classes?.yearTitle)}>
          {`${yearsList[0]}-${yearsList.at(-1)}`}
        </div>
        <Button
          variant="icon"
          startIcon={<ICONS_MAP.ArrowRightIcon />}
          onClick={onIncrementYears}
          className={cn(popoverMenuClasses.yearButton, classes?.yearButton)}
        />
      </div>
      <YearsList
        yearsList={yearsList}
        selectedYear={selectedYear}
        onSelectYear={onSelectYear}
        classes={classes}
      />
    </div>
  );
};

export default appReactMemo(YearsMenu);
