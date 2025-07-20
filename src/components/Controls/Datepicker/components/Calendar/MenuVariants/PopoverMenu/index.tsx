import React, { useCallback, useState } from "react";
import cn from "classnames";

import "./styles.scss";

import Tooltip from "@/components/Controls/Tooltip";
import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";

import { useDatePickerContext } from "../../../../datepickerContext";
import { useDatepickerMenu } from "../useDatepickerMenu";

import { PopoverMenuClasses, popoverMenuClasses } from "./constants";
import MonthMenu from "./MonthMenu";
import YearsMenu from "./YearsMenu";

type PopoverMenuProps = {
  classes?: PopoverMenuClasses;
};

const PopoverMenu = ({ classes }: PopoverMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    monthList,
    yearsList,
    onSelectMonth,
    onSelectYear,
    selectedMonth,
    selectedYear,
    onIncrementYears,
    onDecrementYears,
  } = useDatepickerMenu({ reversed: true });

  const { config } = useDatePickerContext();

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const getDatepickerMenuComponent = useCallback(() => {
    return (
      <div className={cn(popoverMenuClasses.tooltip, classes?.container)}>
        <MonthMenu
          monthList={monthList}
          selectedMonth={selectedMonth}
          onSelectMonth={onSelectMonth}
          classes={classes}
        />
        <YearsMenu
          yearsList={yearsList}
          selectedYear={selectedYear}
          onSelectYear={onSelectYear}
          onIncrementYears={onIncrementYears}
          onDecrementYears={onDecrementYears}
          classes={classes}
        />
      </div>
    );
  }, [
    monthList,
    yearsList,
    onSelectMonth,
    onSelectYear,
    selectedMonth,
    selectedYear,
    onIncrementYears,
    onDecrementYears,
  ]);

  return (
    <Tooltip
      content={getDatepickerMenuComponent()}
      trigger="click"
      open={isOpen}
      onOpen={onOpen}
      defaultPlacement="bottom"
      classes={classes?.tooltip}
    >
      <div
        data-is-active={isOpen}
        className={cn(popoverMenuClasses.openButton, classes?.openButton)}
      >
        {config?.calendarIcon || <ICONS_MAP.CalendarIcon />}
      </div>
    </Tooltip>
  );
};

export default appReactMemo(PopoverMenu);
