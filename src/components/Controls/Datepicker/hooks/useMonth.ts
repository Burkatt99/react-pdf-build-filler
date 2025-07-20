import React from "react";
import { format, Locale } from "date-fns";

import { getDays, getWeekdayLabels } from "../helpers/utils";
import { IUseMonthProps } from "../types";

export const dayLabelFormatFn = (date: Date): string => format(date, "d");
export const weekdayLabelFormatFn = (date: Date, locale?: Locale): string =>
  format(date, "eeeeee", { locale });
export const monthLabelFormatFn = (date: Date, locale?: Locale): string =>
  format(date, "LLLL yyyy", { locale });

export interface IUseMonthResult {
  weekdayLabels: string[];
  days: (0 | { dayLabel: string; date: Date })[];
  monthLabel: string;
}

export const useMonth = ({
  year,
  month,
  firstDayOfWeek = 1,
  dayLabelFormat = dayLabelFormatFn,
  weekdayLabelFormat = weekdayLabelFormatFn,
  monthLabelFormat = monthLabelFormatFn,
  showPrevNextMonthDates = true,
  locale,
}: IUseMonthProps): IUseMonthResult => {
  const days = React.useMemo(
    () =>
      getDays({
        year,
        month,
        dayLabelFormat,
        firstDayOfWeek,
        showPrevNextMonthDates,
      }),
    [year, month, firstDayOfWeek, dayLabelFormat],
  );
  const weekdayLabels = React.useMemo(
    () => getWeekdayLabels({ firstDayOfWeek, weekdayLabelFormat, locale }),
    [firstDayOfWeek, weekdayLabelFormat, locale],
  );

  return {
    days,
    weekdayLabels,
    monthLabel: monthLabelFormat(new Date(year, month), locale),
  };
};
