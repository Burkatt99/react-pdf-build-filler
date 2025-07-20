import {
  add,
  addDays,
  addMinutes,
  addMonths,
  addYears,
  eachDayOfInterval as eachDay,
  eachMonthOfInterval as eachMonth,
  eachYearOfInterval as eachYears,
  endOfDay,
  endOfHour,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getDay,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval as isWithinRange,
  Locale,
  parse,
  setYear,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  sub,
  subMinutes,
} from "date-fns";
import {
  format as formatTimeZone,
  fromZonedTime,
  toZonedTime,
} from "date-fns-tz";

import {
  AMOUNT_YEARS,
  DatePresetType,
  END_DATE,
  FirstDayOfWeek,
  IDatesChangeProps,
  IGetDaysProps,
  IGetWeekdayLabelsProps,
  IInitialDate,
  IRange,
  ITime,
  ITimeType,
  MonthType,
  TCalendarPosition,
  TIMES_OF_DAY,
} from "../types";

import {
  defaultDateState,
  defaultTimeState,
  defaultTimeTypeState,
  rangeEndOfDayDefaultTime,
  rangeEndOfDayDefaultTimeType,
} from "./values";

export const isInUnavailableDates = (
  date: Date,
  unavailableDates: Date[] = [],
): boolean => {
  return unavailableDates.some((_date) => isSameDay(date, _date));
};

export const isDateSelected = (
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
): boolean => {
  if (startDate && endDate) {
    return isWithinRange(date, {
      start: startOfDay(startDate),
      end: endOfDay(endDate),
    });
  }

  return false;
};

export const isFirstSelectedDate = (
  date: Date,
  startDate: Date | null,
): boolean => {
  return !!(startDate && isSameDay(date, startDate));
};

export const isLastSelectedDate = (
  date: Date,
  endDate: Date | null,
): boolean => {
  return !!(endDate && isSameDay(date, endDate));
};

export const isStartDate = (date: Date, startDate: Date | null): boolean => {
  return !!(startDate && isSameDay(date, startDate));
};

export const isEndDate = (date: Date, endDate: Date | null): boolean => {
  return !!(endDate && isSameDay(date, endDate));
};

export const isFirstDifferentLastDate = (
  startDate: Date | null,
  endDate: Date | null,
): boolean => {
  return !(startDate && endDate && isSameDay(startDate, endDate));
};

interface IIsDateBlocked {
  date: Date;
  startDate: Date | null;
  endDate: Date | null;
  minBookingDays?: number;
  minBookingDate?: Date;
  maxBookingDate?: Date;
  isDateBlockedFn: (date: Date) => boolean;
  unavailableDates?: Date[];
  activeMonths: MonthType[];
  isOtherMonthsBlocked?: boolean;
}

export const isDateBlocked = ({
  date,
  minBookingDate,
  maxBookingDate,
  isDateBlockedFn,
  startDate,
  endDate,
  minBookingDays = 1,
  unavailableDates = [],
  activeMonths,
  isOtherMonthsBlocked,
}: IIsDateBlocked): boolean => {
  const compareMinDate = minBookingDate
    ? new Date(
        minBookingDate.getFullYear(),
        minBookingDate.getMonth(),
        minBookingDate.getDate(),
        0,
        0,
        0,
      )
    : minBookingDate;
  const compareMaxDate = maxBookingDate
    ? new Date(
        maxBookingDate.getFullYear(),
        maxBookingDate.getMonth(),
        maxBookingDate.getDate(),
        0,
        0,
        0,
      )
    : maxBookingDate;

  return !!(
    isInUnavailableDates(date, unavailableDates) ||
    (compareMinDate && isBefore(date, compareMinDate)) ||
    (compareMaxDate && isAfter(date, compareMaxDate)) ||
    (startDate &&
      !endDate &&
      minBookingDays > 1 &&
      isWithinRange(date, {
        start: startDate,
        end: addDays(startDate, minBookingDays - 2),
      })) ||
    isDateBlockedFn(date) ||
    (isOtherMonthsBlocked && !isSameMonth(date, activeMonths[0].date))
  );
};

export const getDateMonthAndYear = (date: Date): MonthType => {
  const today = startOfMonth(date);
  const year = getYear(today);
  const month = getMonth(today);
  return {
    year,
    month,
    date: today,
  };
};

export const getCurrentYearMonthAndDate = (): MonthType => {
  return getDateMonthAndYear(startOfToday());
};

export const getActiveMonths = (
  numberOfMonths: number,
  startDate: Date | null,
): MonthType[] => {
  const firstMonth = startDate
    ? getDateMonthAndYear(startDate)
    : getCurrentYearMonthAndDate();
  let prevMonthDate = firstMonth.date;
  let months = [firstMonth];

  if (numberOfMonths > 1) {
    months = Array.from(Array(numberOfMonths - 1).keys()).reduce(
      (m: MonthType[]) => {
        prevMonthDate = addMonths(m[m.length - 1].date, 1);
        return m.concat([getDateMonthAndYear(prevMonthDate)]);
      },
      months,
    );
  }

  return months;
};

interface IGetInitialMonths {
  numberOfMonths: number;
  startDate: Date | null;
  endDate: Date | null;
  position: TCalendarPosition | null;
  initialVisibleMonth?: Date;
  initialAsEndMonth?: boolean;
}

export const getInitialMonths = ({
  numberOfMonths,
  startDate,
  endDate,
  position,
  initialVisibleMonth,
  initialAsEndMonth,
}: IGetInitialMonths): MonthType[] => {
  if (initialAsEndMonth && endDate) {
    return getActiveMonths(numberOfMonths, endDate);
  }

  if (!position || position === "from") {
    if (startDate) {
      return getActiveMonths(numberOfMonths, startDate);
    }
    return getActiveMonths(numberOfMonths, initialVisibleMonth || null);
  }

  if (endDate) {
    return getActiveMonths(numberOfMonths, endDate);
  }

  if (startDate) {
    return getActiveMonths(numberOfMonths, addMonths(startDate, 1));
  }

  if (initialVisibleMonth) {
    return getActiveMonths(numberOfMonths, addMonths(initialVisibleMonth, 1));
  }

  return getActiveMonths(numberOfMonths, addMonths(new Date(), 1));
};

export const getNextActiveMonth = (
  activeMonth: MonthType[],
  numberOfMonths: number,
  counter: number,
  step?: number,
): MonthType[] => {
  let prevMonth;

  if (step) {
    prevMonth = counter > 0 ? 0 : activeMonth.length - step;
  } else {
    prevMonth = counter > 0 ? activeMonth.length - 1 : 0;
  }

  let prevMonthDate = activeMonth[prevMonth].date;

  return Array.from(Array(numberOfMonths).keys()).reduce((m: MonthType[]) => {
    if (m.length === 0) {
      prevMonthDate = addMonths(prevMonthDate, counter);
    } else {
      prevMonthDate = addMonths(prevMonthDate, counter >= 0 ? 1 : -1);
    }

    return counter > 0
      ? m.concat([getDateMonthAndYear(prevMonthDate)])
      : [getDateMonthAndYear(prevMonthDate)].concat(m);
  }, []);
};

export type FormatFunction = (date: Date) => string;

export const getInputValue = (
  date: Date | null,
  displayFormat: string | FormatFunction,
  defaultValue: string,
): string => {
  if (date && typeof displayFormat === "string") {
    return format(date, displayFormat);
  }
  if (date && typeof displayFormat === "function") {
    return displayFormat(date);
  }
  return defaultValue;
};

export interface ICanSelectRange {
  startDate: Date;
  endDate: Date | null;
  isDateBlocked(date: Date): boolean;
  minBookingDays: number;
  exactMinBookingDays?: boolean;
  minBookingDate?: Date;
  maxBookingDate?: Date;
}
export const canSelectRange = ({
  startDate,
  endDate,
  isDateBlocked,
  minBookingDays,
  exactMinBookingDays,
  minBookingDate,
  maxBookingDate,
}: ICanSelectRange): boolean => {
  const isStartDateAfterOrEqualMinDate = minBookingDate
    ? !isBefore(startDate, addDays(minBookingDate, -1))
    : true;
  const isStartDateBeforeOrEqualMaxDate = maxBookingDate
    ? !isAfter(addDays(startDate, minBookingDays - 1), maxBookingDate)
    : true;

  if (
    startDate &&
    minBookingDays === 1 &&
    !endDate &&
    !isDateBlocked(startDate)
  ) {
    return true;
  }
  if (
    (startDate && minBookingDays > 1 && !endDate && !exactMinBookingDays) ||
    (startDate &&
      minBookingDays > 0 &&
      exactMinBookingDays &&
      isStartDateAfterOrEqualMinDate &&
      isStartDateBeforeOrEqualMaxDate) ||
    (startDate &&
      minBookingDays > 0 &&
      exactMinBookingDays &&
      !minBookingDate &&
      !maxBookingDate)
  ) {
    return !eachDay({
      start: startDate,
      end: addDays(startDate, minBookingDays - 1),
    }).some((d) => isDateBlocked(d));
  }
  if (startDate && endDate && !exactMinBookingDays) {
    const minBookingDaysDate = addDays(startDate, minBookingDays - 1);

    if (isBefore(endDate, minBookingDaysDate)) {
      return false;
    }

    return !eachDay({ start: startDate, end: endDate }).some((d) =>
      isDateBlocked(d),
    );
  }

  return false;
};

export interface IIsDateHovered {
  startDate: Date | null;
  endDate: Date | null;
  date: Date;
  isDateBlocked(date: Date): boolean;
  hoveredDate: Date | null;
  minBookingDays: number;
  exactMinBookingDays: boolean;
}
export const isDateHovered = ({
  date,
  startDate,
  endDate,
  isDateBlocked,
  hoveredDate,
  minBookingDays,
  exactMinBookingDays,
}: IIsDateHovered): boolean => {
  if (
    // exact min booking days
    hoveredDate &&
    minBookingDays > 1 &&
    exactMinBookingDays &&
    isWithinRange(date, {
      start: hoveredDate,
      end: addDays(hoveredDate, minBookingDays - 1),
    })
  ) {
    return !eachDay({
      start: hoveredDate,
      end: addDays(hoveredDate, minBookingDays - 1),
    }).some((d) => isDateBlocked(d));
  }
  if (
    // min booking days
    startDate &&
    !endDate &&
    hoveredDate &&
    isWithinRange(date, {
      start: startDate,
      end: addDays(startDate, minBookingDays - 1),
    }) &&
    isSameDay(startDate, hoveredDate) &&
    minBookingDays > 1
  ) {
    return !eachDay({
      start: startDate,
      end: addDays(startDate, minBookingDays - 1),
    }).some((d) => isDateBlocked(d));
  }
  if (
    // normal
    startDate &&
    !endDate &&
    hoveredDate &&
    !isBefore(hoveredDate, startDate) &&
    !isSameDay(hoveredDate, startDate) &&
    isWithinRange(date, { start: startDate, end: hoveredDate })
  ) {
    return !eachDay({ start: startDate, end: hoveredDate }).some((d) =>
      isDateBlocked(d),
    );
  }

  return false;
};

export const getWeekdayLabels = ({
  firstDayOfWeek = 1,
  weekdayLabelFormat = (date: Date) => format(date, "iiiiii"),
  locale,
}: IGetWeekdayLabelsProps = {}): string[] => {
  const now = new Date();
  const arr = eachDay({
    start: addDays(startOfWeek(now), firstDayOfWeek),
    end: addDays(endOfWeek(now), firstDayOfWeek),
  });
  return arr.reduce((array, date) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    array.push(weekdayLabelFormat(date, locale));
    return array;
  }, []);
};

export type CalendarDay = 0 | { dayLabel: string; date: Date };

export const getDays = ({
  year,
  month,
  dayLabelFormat = (date: Date) => format(date, "dd"),
  firstDayOfWeek = 1,
  showPrevNextMonthDates,
}: IGetDaysProps): CalendarDay[] => {
  const date = new Date(year, month);

  const timezoneOffset = date.getTimezoneOffset();

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const start = startOfWeek(monthStart, { weekStartsOn: firstDayOfWeek });
  const end = endOfWeek(monthEnd, { weekStartsOn: firstDayOfWeek });
  const monthStartDay = getDay(monthStart);

  const monthWithoutPrevDays = Array.from(
    Array(
      monthStartDay >= firstDayOfWeek
        ? monthStartDay - firstDayOfWeek
        : 6 - firstDayOfWeek + monthStartDay + 1,
    ).keys(),
  ).fill(0);

  const convertToUTCStartOfDay = (date: Date | number) => {
    const offset = Math.abs(timezoneOffset);
    return timezoneOffset < 0
      ? addMinutes(date, offset)
      : subMinutes(date, offset);
  };

  const days = eachDay({ start: monthStart, end: monthEnd }).map((date) => ({
    date: convertToUTCStartOfDay(date),
    dayLabel: dayLabelFormat(date),
  }));

  const monthWithPrevDays = eachDay({ start, end }).map((date) => ({
    date: convertToUTCStartOfDay(date),
    dayLabel: dayLabelFormat(date),
  }));

  return showPrevNextMonthDates
    ? monthWithPrevDays
    : [...(monthWithoutPrevDays as 0[]), ...days];
};

export interface IMonthsList {
  monthNumber: number;
  monthLabel: string;
}

export const getMonthsList = (locale?: Locale): IMonthsList[] => {
  const date = new Date();
  const start = startOfYear(date);
  const end = endOfYear(date);

  return eachMonth({ start, end }).map((date) => ({
    monthNumber: Number(format(date, "L")) - 1,
    monthLabel: format(date, "LLLL", { locale }),
  }));
};

interface IGetYearsList {
  year: number;
  yearsAmount?: number;
  reversed?: boolean;
}

export const getYearsList = ({
  year,
  yearsAmount = AMOUNT_YEARS,
  reversed,
}: IGetYearsList): number[] => {
  const end = setYear(new Date(), year);
  const start = addYears(end, -(yearsAmount - 1));

  const yearsList = eachYears({ start, end }).map((date) =>
    Number(format(date, "Y")),
  );

  return reversed ? yearsList.reverse() : yearsList;
};

export interface IDayOfWeek {
  firstDayOfWeek?: FirstDayOfWeek;
  date: Date;
}

export const isLastDayOfWeek = ({
  date,
  firstDayOfWeek = 1,
}: IDayOfWeek): boolean => {
  const last = endOfWeek(date, { weekStartsOn: firstDayOfWeek });
  return isSameDay(last, date);
};

export const isFirstDayOfWeek = ({
  date,
  firstDayOfWeek = 1,
}: IDayOfWeek): boolean => {
  const first = startOfWeek(date, { weekStartsOn: firstDayOfWeek });
  return isSameDay(first, date);
};

interface IDateToZeroUtc {
  date: Date | null;
  timezone?: string;
}

export const dateToZeroUtc = ({ date, timezone }: IDateToZeroUtc): string => {
  if (date) {
    return timezone
      ? fromZonedTime(date, timezone).toISOString()
      : date.toISOString();
  }

  return "";
};

export const getTimeZonedDate = ({
  date,
  timezone,
}: IDateToZeroUtc): string => {
  if (!date) {
    return "";
  }

  return formatTimeZone(new Date(date), "yyyy-MM-dd'T'HH:mm:ssXXX", {
    timeZone: timezone,
  });
};

export const parseAndFormatTime = (
  parseString: string,
  inFormat: string,
  outFormat: string,
): string => {
  return format(parse(parseString, inFormat, new Date()), outFormat);
};

export const capitalizeFirstLetter = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1);
};

// ========== DatePreset utils ============

interface IGetRangeDate extends DatePresetType {
  startDayOfWeek: FirstDayOfWeek;
}

export const getRangeDates = ({
  timeType,
  number,
  variant,
  startDayOfWeek,
}: IGetRangeDate): IRange => {
  let from;
  let to;

  switch (variant) {
    case "current":
      from = new Date();
      to = new Date();
      break;
    case "next":
      from = add(new Date(), {
        [timeType]: 1,
      });
      to = add(new Date(), {
        [timeType]: number,
      });
      break;
    case "prev":
      from = sub(new Date(), {
        [timeType]: number,
      });
      to = sub(new Date(), {
        [timeType]: 1,
      });
      break;
    default:
      from = new Date();
      to = new Date();
  }

  switch (timeType) {
    case "years":
      return {
        startDate: startOfYear(startOfDay(from)),
        endDate: endOfYear(startOfDay(to)),
      };
    case "months":
      return {
        startDate: startOfMonth(startOfDay(from)),
        endDate: endOfMonth(startOfDay(to)),
      };
    case "weeks":
      return {
        startDate: startOfWeek(startOfDay(from), {
          weekStartsOn: startDayOfWeek,
        }),
        endDate: endOfWeek(startOfDay(to), { weekStartsOn: startDayOfWeek }),
      };
    case "days":
      return {
        startDate: startOfDay(from),
        endDate: endOfDay(to),
      };
    case "hours":
      return {
        startDate: startOfHour(from),
        endDate: endOfHour(to),
      };
    default:
      return {
        startDate: null,
        endDate: null,
      };
  }
};

const getParsedAndTimeZonedDate = (
  value: string,
  format: string,
  timeZone?: string,
) => {
  const parsedDate = parse(value, format, new Date());

  if (!timeZone) {
    return parsedDate;
  }

  const utc = parsedDate.toISOString();
  return toZonedTime(utc, timeZone);
};

export const getInitialDate = (
  initialDate?: IInitialDate,
  initialTimeZone?: string,
): IDatesChangeProps => {
  if (!initialDate) {
    return defaultDateState;
  }

  const { start } = initialDate;

  const normalizedStartDate =
    start.date ||
    (start.value && start.format
      ? getParsedAndTimeZonedDate(start.value, start.format, initialTimeZone)
      : null);

  return {
    startDate: normalizedStartDate || null,
    endDate: normalizedStartDate || null,
    focusedInput: normalizedStartDate ? END_DATE : null,
  };
};

export const getInitialTime = (
  initialDate?: IInitialDate,
  rangeDefaultEndOfDay?: boolean,
  initialTimeZone?: string,
): ITime => {
  if (!initialDate) {
    return rangeDefaultEndOfDay ? rangeEndOfDayDefaultTime : defaultTimeState;
  }

  const { start } = initialDate;

  const normalizedStartDate =
    start.date ||
    (start.value && start.format
      ? getParsedAndTimeZonedDate(start.value, start.format, initialTimeZone)
      : null);

  const startTime = {
    hours: normalizedStartDate ? format(normalizedStartDate, "HH") : null,
    minutes: normalizedStartDate ? format(normalizedStartDate, "mm") : null,
    seconds: normalizedStartDate ? format(normalizedStartDate, "ss") : null,
  };

  return {
    from: startTime,
    to: {
      hours: null,
      minutes: null,
      seconds: null,
    },
  };
};

export const getInitialTimeType = (
  initialDate?: IInitialDate,
  rangeDefaultEndOfDay?: boolean,
  initialTimeZone?: string,
): ITimeType => {
  if (!initialDate) {
    return rangeDefaultEndOfDay
      ? rangeEndOfDayDefaultTimeType
      : defaultTimeTypeState;
  }

  const { start } = initialDate;

  const startDate =
    start.date ||
    (start.value && start.format
      ? getParsedAndTimeZonedDate(start.value, start.format, initialTimeZone)
      : null);
  const normalizedStart = startDate ? format(startDate, "a") : TIMES_OF_DAY.AM;

  return {
    from: normalizedStart as TIMES_OF_DAY,
    to: TIMES_OF_DAY.AM,
  };
};
