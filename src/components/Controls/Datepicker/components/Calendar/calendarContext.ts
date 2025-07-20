import React from "react";
import { Locale } from "date-fns";

import { IOnAddActiveDate, MonthType } from "../../types";

export interface ICalendarContextDefaultValue {
  focusedDate: Date | null;
  isDateFocused: (date: Date) => boolean;
  isCurrentHoveredDate: (date: Date) => boolean;
  isHoveredAfterStartDate: (date: Date) => boolean;
  isDateSelected: (date: Date) => boolean;
  isDateHovered: (date: Date) => boolean;
  isDateBlocked: (date: Date) => boolean;
  isFirstSelectedDate: (date: Date) => boolean;
  isLastSelectedDate: (date: Date) => boolean;
  isFirstDifferentLastDate: () => boolean;
  onDateFocus: (date: Date) => void;
  onDateHover: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  onAddActiveDate: (props: IOnAddActiveDate) => void;
  activeMonths: MonthType[];
  locale?: Locale;
}

export const calendarContextDefaultValue: ICalendarContextDefaultValue = {
  focusedDate: null,
  isDateFocused: () => false,
  isCurrentHoveredDate: () => false,
  isHoveredAfterStartDate: () => false,
  isDateSelected: () => false,
  isDateHovered: () => false,
  isDateBlocked: () => false,
  isFirstSelectedDate: () => false,
  isLastSelectedDate: () => false,
  isFirstDifferentLastDate: () => false,
  onDateFocus: () => {},
  onDateHover: () => {},
  onDateSelect: () => {},
  onAddActiveDate: () => {},
  activeMonths: [],
  locale: undefined,
};

export const CalendarContext = React.createContext(calendarContextDefaultValue);

export const CalendarContextProvider = CalendarContext.Provider;

export const useCalendarContext = (): ICalendarContextDefaultValue =>
  React.useContext(CalendarContext);
