import React from "react";
import { addDays, isSameDay } from "date-fns";

import { isFirstDayOfWeek, isLastDayOfWeek } from "../helpers/utils";
import { FirstDayOfWeek } from "../types";

interface UseDayProps {
  date: Date;
  focusedDate: Date | null;
  firstDayOfWeek?: FirstDayOfWeek;
  isDateFocused(date: Date): boolean;
  isCurrentHoveredDate(date: Date): boolean;
  isHoveredAfterStartDate(date: Date): boolean;
  isDateSelected(date: Date): boolean;
  isDateHovered(date: Date): boolean;
  isDateBlocked(date: Date): boolean;
  isFirstSelectedDate(date: Date): boolean;
  isLastSelectedDate(date: Date): boolean;
  isFirstDifferentLastDate(): boolean;
  onDateFocus(date: Date): void;
  onDateSelect(date: Date): void;
  onDateHover(date: Date): void;
}

interface IUseDayResult {
  tabIndex: number;
  isSelected: boolean;
  isHovered: boolean;
  isHoveredAfterStart: boolean;
  isSelectedStart: boolean;
  isSelectedEnd: boolean;
  isWithinHoverRange: boolean;
  isLastOfWeek: boolean;
  isFirstOfWeek: boolean;
  isDifferentDate: boolean;
  disabledDate: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onClick: () => void;
  onMouseEnter: () => void;
  isCurrentDay: boolean;
}

export const useDay = ({
  date,
  focusedDate,
  firstDayOfWeek,
  isCurrentHoveredDate,
  isHoveredAfterStartDate,
  isDateSelected,
  isDateFocused,
  isFirstSelectedDate,
  isLastSelectedDate,
  isDateHovered,
  isDateBlocked,
  onDateSelect,
  onDateFocus,
  onDateHover,
  isFirstDifferentLastDate,
}: UseDayProps): IUseDayResult => {
  const onClick = React.useCallback(
    () => onDateSelect(date),
    [date, onDateSelect],
  );
  const onMouseEnter = React.useCallback(
    () => onDateHover(date),
    [date, onDateHover],
  );

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight") {
        onDateFocus(addDays(date, 1));
      } else if (e.key === "ArrowLeft") {
        onDateFocus(addDays(date, -1));
      } else if (e.key === "ArrowUp") {
        onDateFocus(addDays(date, -7));
      } else if (e.key === "ArrowDown") {
        onDateFocus(addDays(date, 7));
      }
    },
    [onDateFocus],
  );

  const disabled = React.useMemo(
    () => isDateBlocked(date) && !isDateHovered(date),
    [isDateBlocked, isDateHovered, date],
  );
  const isCurrentDay = React.useMemo(() => isSameDay(date, new Date()), [date]);

  return {
    tabIndex: focusedDate === null || isDateFocused(date) ? 0 : -1,
    isSelected: isDateSelected(date),
    isHovered: isCurrentHoveredDate(date),
    isHoveredAfterStart: isHoveredAfterStartDate(date),
    isSelectedStart: isFirstSelectedDate(date),
    isSelectedEnd: isLastSelectedDate(date),
    isWithinHoverRange: isDateHovered(date),
    isLastOfWeek: isLastDayOfWeek({ date, firstDayOfWeek }),
    isFirstOfWeek: isFirstDayOfWeek({ date, firstDayOfWeek }),
    isDifferentDate: isFirstDifferentLastDate(),
    disabledDate: disabled,
    onKeyDown,
    onClick: disabled ? () => {} : onClick,
    onMouseEnter,
    isCurrentDay,
  };
};
