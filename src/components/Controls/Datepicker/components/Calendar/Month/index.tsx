import React from "react";
import cn from "classnames";

import "./styles.scss";

import Button from "@/components/Button";
import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";

import { useDatePickerContext } from "../../../datepickerContext";
import { useMonth } from "../../../hooks";
import { IUseMonthProps } from "../../../types";
import { useCalendarContext } from "../calendarContext";
import { calendarClasses, TCalendarClasses } from "../constants";
import Day from "../Day";
import InnerMenu from "../MenuVariants/InnerMenu";
import PopoverMenu from "../MenuVariants/PopoverMenu";
import { useDatepickerMenu } from "../MenuVariants/useDatepickerMenu";

interface IMonthProps extends IUseMonthProps {
  nextMonthButton?: React.ReactNode;
  prevMonthButton?: React.ReactNode;
  goToPreviousMonths: () => void;
  goToNextMonths: () => void;
  classes?: TCalendarClasses;
}

const Month = (props: IMonthProps) => {
  const {
    year,
    month,
    firstDayOfWeek,
    nextMonthButton,
    prevMonthButton,
    goToNextMonths,
    goToPreviousMonths,
    classes,
  } = props;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { locale } = useCalendarContext();
  const { datepickerSettings, config } = useDatePickerContext();

  const { disableDatepickerMenu, datepickerMenuInPopover } = datepickerSettings;

  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek,
    locale,
  });

  const datepickerMenu = useDatepickerMenu({ yearsAmount: 3 });

  const menuOpenHandler = () => {
    if (isMenuOpen) {
      datepickerMenu.onSetActiveDate();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const renderDatePickerVariant = () => {
    if (disableDatepickerMenu) {
      return;
    }

    if (datepickerMenuInPopover) {
      return <PopoverMenu />;
    }

    return (
      <Button
        variant="icon"
        data-is-active={isMenuOpen}
        onClick={menuOpenHandler}
        startIcon={config?.calendarIcon || <ICONS_MAP.CalendarMonthIcon />}
        className={cn(
          calendarClasses.calendarIconButton,
          classes?.calendarIconButton,
        )}
      />
    );
  };

  const renderContent = () => {
    if (isMenuOpen) {
      return <InnerMenu {...datepickerMenu} classes={classes} />;
    }

    return (
      <>
        <div
          className={cn(
            calendarClasses.weekdaysWrapper,
            classes?.weekdaysWrapper,
          )}
        >
          {weekdayLabels.map((dayLabel) => (
            <div
              key={dayLabel}
              className={cn(calendarClasses.dayLabel, classes?.dayLabel)}
            >
              <p
                className={cn(
                  calendarClasses.dayLabelText,
                  classes?.dayLabelText,
                )}
              >
                {dayLabel}
              </p>
            </div>
          ))}
        </div>
        <div
          className={cn(
            calendarClasses.weekdaysWrapper,
            classes?.weekdaysWrapper,
          )}
        >
          {days.map((day, index) => {
            if (day) {
              return (
                <Day
                  date={day.date}
                  key={day.date.toString()}
                  dayLabel={day.dayLabel}
                  firstDayOfWeek={firstDayOfWeek}
                  classes={classes}
                />
              );
            }

            return <div key={index} />;
          })}
        </div>
      </>
    );
  };

  return (
    <div
      className={cn(calendarClasses.monthContainer, classes?.monthContainer)}
    >
      <div className={cn(calendarClasses.monthHeader, classes?.monthHeader)}>
        {prevMonthButton || (
          <Button
            variant="icon"
            startIcon={<ICONS_MAP.ArrowLeftIcon />}
            onClick={goToPreviousMonths}
            className={cn(calendarClasses.monthButton, classes?.monthButton)}
          />
        )}
        <div
          className={cn(
            calendarClasses.monthLabelWrapper,
            classes?.monthLabelWrapper,
          )}
        >
          {renderDatePickerVariant()}
          <div className={cn(calendarClasses.monthLabel, classes?.monthLabel)}>
            {monthLabel}
          </div>
        </div>
        {nextMonthButton || (
          <Button
            variant="icon"
            startIcon={<ICONS_MAP.ArrowRightIcon />}
            onClick={goToNextMonths}
            className={cn(calendarClasses.monthButton, classes?.monthButton)}
          />
        )}
      </div>
      <div
        className={cn(
          calendarClasses.calendarContent,
          classes?.calendarContent,
        )}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default appReactMemo(Month);
