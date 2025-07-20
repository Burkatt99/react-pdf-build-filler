import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";

import { useDatePickerContext } from "../../../datepickerContext";
import { useDay } from "../../../hooks";
import { FirstDayOfWeek } from "../../../types";
import { useCalendarContext } from "../calendarContext";
import { calendarClasses, TCalendarClasses } from "../constants";

interface IDay {
  dayLabel?: string;
  date: Date;
  firstDayOfWeek?: FirstDayOfWeek;
  classes?: TCalendarClasses;
}

const Day = (props: IDay) => {
  const { dayLabel, date, firstDayOfWeek, classes } = props;

  const {
    focusedDate,
    isCurrentHoveredDate,
    isHoveredAfterStartDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isLastSelectedDate,
    isFirstSelectedDate,
    onDateSelect,
    onDateFocus,
    onDateHover,
    isFirstDifferentLastDate,
  } = useCalendarContext();

  const { datepickerSettings } = useDatePickerContext();

  const {
    isSelected,
    isSelectedStart,
    isSelectedEnd,
    isWithinHoverRange,
    disabledDate,
    onClick,
    onMouseEnter,
    tabIndex,
    isCurrentDay,
    isHovered,
    isHoveredAfterStart,
    isLastOfWeek,
    isFirstOfWeek,
    isDifferentDate,
  } = useDay({
    date,
    focusedDate,
    firstDayOfWeek,
    isCurrentHoveredDate,
    isHoveredAfterStartDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isLastSelectedDate,
    isFirstSelectedDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    isFirstDifferentLastDate,
  });

  if (!dayLabel) {
    return <div />;
  }

  return (
    <div
      role="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      className={cn(calendarClasses.dayContainer, classes?.dayContainer)}
    >
      <div
        className={cn(calendarClasses.day, classes?.day, {
          [`${calendarClasses.day}--disabled ${classes?.day}--disabled`]:
            disabledDate,
          [`${calendarClasses.day}--current ${classes?.day}--current`]:
            isCurrentDay && !isSelectedStart && !isSelectedEnd && !disabledDate,
          [`${calendarClasses.day}--selectedStart ${classes?.day}--selectedStart`]:
            isSelectedStart,
          [`${calendarClasses.day}--selectedEnd ${classes?.day}--selectedEnd`]:
            isSelectedEnd,
          [`${calendarClasses.day}--selected ${classes?.day}--selected`]:
            isSelected && !isSelectedStart && !isSelectedEnd && !isCurrentDay,
          [`${calendarClasses.day}--hovered ${classes?.day}--hovered`]:
            isHovered && !isSelectedStart && !isSelectedEnd && !isCurrentDay,
          [`${calendarClasses.day}--currentHover ${classes?.day}--currentHover`]:
            !isHovered &&
            !isSelected &&
            !isCurrentDay &&
            !disabledDate &&
            !isSelectedStart &&
            !isSelectedEnd,
        })}
      >
        {dayLabel}
      </div>
      <div
        className={cn(calendarClasses.dayBackground, classes?.dayBackground, {
          [`${calendarClasses.day}--selectedStart ${classes?.day}--selectedStart`]:
            isSelectedStart && isSelected && !isLastOfWeek && isDifferentDate,
          [`${calendarClasses.day}--hoveredStart ${classes?.day}--hoveredStart`]:
            !datepickerSettings.hideHoveredRange &&
            isSelectedStart &&
            isWithinHoverRange &&
            !isLastOfWeek,
          [`${calendarClasses.day}--selectedEnd ${classes?.day}--selectedEnd`]:
            isSelectedEnd && isSelected && isDifferentDate && !isFirstOfWeek,
          [`${calendarClasses.day}--selected ${classes?.day}--selected`]:
            isSelected && !isFirstOfWeek && !isLastOfWeek && isDifferentDate,
          [`${calendarClasses.day}--hovered ${classes?.day}--hovered`]:
            !datepickerSettings.hideHoveredRange &&
            isHovered &&
            !isSelected &&
            !isFirstOfWeek &&
            isHoveredAfterStart,
          [`${calendarClasses.day}--hoveredRange ${classes?.day}--hoveredRange`]:
            !datepickerSettings.hideHoveredRange &&
            isWithinHoverRange &&
            !isHovered &&
            !isFirstOfWeek &&
            !isLastOfWeek,
          [`${calendarClasses.day}--selectedFirstOfWeek ${classes?.day}--selectedFirstOfWeek`]:
            isSelected && isFirstOfWeek && !isSelectedEnd,
          [`${calendarClasses.day}--selectedLastOfWeek ${classes?.day}--selectedLastOfWeek`]:
            isSelected && isLastOfWeek && !isSelectedStart,
          [`${calendarClasses.day}--hoveredRangeFirstOfWeek ${classes?.day}--hoveredRangeFirstOfWeek`]:
            !datepickerSettings.hideHoveredRange &&
            isWithinHoverRange &&
            !isHovered &&
            isFirstOfWeek,
          [`${calendarClasses.day}--hoveredRangeLastOfWeek ${classes?.day}--hoveredRangeLastOfWeek`]:
            !datepickerSettings.hideHoveredRange &&
            isWithinHoverRange &&
            !isHovered &&
            !isSelectedStart &&
            isLastOfWeek,
        })}
      />
    </div>
  );
};

export default appReactMemo(Day);
