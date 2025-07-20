import React from "react";
import cn from "classnames";

import { appReactMemo } from "@/hocs/appReactMemo";

import { useDatePickerContext } from "../../datepickerContext";
import { useDatepicker } from "../../hooks";
import { ICalendar } from "../../types";

import { CalendarContextProvider } from "./calendarContext";
import { calendarClasses } from "./constants";
import Month from "./Month";

const Calendar = ({ position, classes }: ICalendar) => {
  const {
    state,
    startDayOfWeek,
    handleDateChange,
    isDateBlockedChecker,
    locale,
    config,
  } = useDatePickerContext();

  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isCurrentHoveredDate,
    isHoveredAfterStartDate,
    isDateHovered,
    isFirstSelectedDate,
    isLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    onAddActiveDate,
    goToPreviousMonths,
    goToNextMonths,
    hoveredDate,
    isFirstDifferentLastDate,
  } = useDatepicker({
    startDate: state.startDate,
    endDate: state.endDate,
    focusedInput: state.focusedInput,
    onDatesChange: handleDateChange,
    numberOfMonths: 1,
    isOtherMonthsBlocked: true,
    exactMinBookingDays: true,
    firstDayOfWeek: startDayOfWeek,
    position: position || null,
    initialVisibleMonth: config?.initialVisibleMonth,
    initialAsEndMonth: config?.initialAsEndMonth,
    isDateBlockedChecker,
  });

  const contextValue = React.useMemo(() => {
    return {
      focusedDate,
      isDateFocused,
      isDateSelected,
      isDateHovered,
      isCurrentHoveredDate,
      isHoveredAfterStartDate,
      isDateBlocked,
      isFirstSelectedDate,
      isLastSelectedDate,
      onDateSelect,
      onDateFocus,
      onDateHover,
      hoveredDate,
      isFirstDifferentLastDate,
      activeMonths,
      onAddActiveDate,
      locale,
    };
  }, [
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstSelectedDate,
    isLastSelectedDate,
    isCurrentHoveredDate,
    isHoveredAfterStartDate,
    onDateSelect,
    onDateFocus,
    onDateHover,
    onAddActiveDate,
    hoveredDate,
    isFirstDifferentLastDate,
    activeMonths,
    locale,
  ]);

  return (
    <div className={cn(calendarClasses.container, classes?.container)}>
      <CalendarContextProvider value={contextValue}>
        {activeMonths.map((month) => (
          <Month
            key={`${month.year}-${month.month}`}
            year={month.year}
            month={month.month}
            firstDayOfWeek={firstDayOfWeek}
            goToNextMonths={goToNextMonths}
            goToPreviousMonths={goToPreviousMonths}
          />
        ))}
      </CalendarContextProvider>
    </div>
  );
};

export default appReactMemo(Calendar);
