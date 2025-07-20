import { useCallback, useEffect, useState } from "react";
import {
  addDays,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval as isWithinRange,
  setMonth,
  setYear,
} from "date-fns";

import { useUpdateEffect } from "@/hooks/useUpdateEffect";

import {
  canSelectRange,
  getActiveMonths,
  getInitialMonths,
  getNextActiveMonth,
  isDateBlocked as isDateBlockedFn,
  isDateHovered as isDateHoveredFn,
  isDateSelected as isDateSelectedFn,
  isEndDate as isEndDateFn,
  isFirstDifferentLastDate as isFirstDifferentLastDateFn,
  isFirstSelectedDate as isFirstSelectedDateFn,
  isInUnavailableDates,
  isLastSelectedDate as isLastSelectedDateFn,
  isStartDate as isStartDateFn,
} from "../helpers/utils";
import {
  END_DATE,
  FirstDayOfWeek,
  IDateBlockerChecker,
  IDatesChangeProps,
  IOnAddActiveDate,
  MonthType,
  START_DATE,
  TCalendarPosition,
  TFocusedInput,
} from "../types";

export interface UseDatepickerProps {
  onDatesChange(data: IDatesChangeProps): void;
  minBookingDate?: Date;
  maxBookingDate?: Date;
  startDate: Date | null;
  endDate: Date | null;
  focusedInput: TFocusedInput;
  numberOfMonths?: number;
  minBookingDays?: number;
  exactMinBookingDays?: boolean;
  firstDayOfWeek?: FirstDayOfWeek;
  initialVisibleMonth?: Date;
  isDateBlockedChecker?: IDateBlockerChecker;
  unavailableDates?: Date[];
  changeActiveMonthOnSelect?: boolean;
  isOtherMonthsBlocked?: boolean;
  position: TCalendarPosition | null;
  initialAsEndMonth?: boolean;
}

interface IUseDatepickerResult {
  firstDayOfWeek: FirstDayOfWeek;
  activeMonths: MonthType[];
  isDateSelected: (date: Date) => boolean;
  isCurrentHoveredDate: (date: Date) => boolean;
  isHoveredAfterStartDate: (date: Date) => boolean;
  isDateHovered: (date: Date) => boolean;
  isFirstSelectedDate: (date: Date) => boolean;
  isLastSelectedDate: (date: Date) => boolean;
  isFirstDifferentLastDate: () => boolean;
  isStartDate: (date: Date) => boolean;
  isEndDate: (date: Date) => boolean;
  isDateBlocked: (date: Date) => boolean;
  numberOfMonths: number;
  isDateFocused: (date: Date) => boolean;
  focusedDate: Date | null;
  hoveredDate: Date | null;
  onResetDates: () => void;
  onDateHover: (date: Date | null) => void;
  onDateSelect: (date: Date) => void;
  onDateFocus: (date: Date) => void;
  onAddActiveDate: (props: IOnAddActiveDate) => void;
  goToPreviousMonths: () => void;
  goToPreviousMonthsByOneMonth: () => void;
  goToNextMonths: () => void;
  goToNextMonthsByOneMonth: () => void;
  goToDate: (date: Date) => void;
  goToPreviousYear: (numYears?: number) => void;
  goToNextYear: (numYears?: number) => void;
}

export const useDatepicker = ({
  startDate,
  endDate,
  focusedInput,
  minBookingDate,
  maxBookingDate,
  onDatesChange,
  initialVisibleMonth,
  exactMinBookingDays = false,
  minBookingDays = 1,
  numberOfMonths = 1,
  firstDayOfWeek = 1,
  isDateBlockedChecker = () => false,
  unavailableDates = [],
  changeActiveMonthOnSelect = true,
  isOtherMonthsBlocked,
  position,
  initialAsEndMonth,
}: UseDatepickerProps): IUseDatepickerResult => {
  const [activeMonths, setActiveMonths] = useState(() =>
    getInitialMonths({
      numberOfMonths,
      initialVisibleMonth,
      endDate,
      startDate,
      position,
      initialAsEndMonth,
    }),
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(startDate);

  useUpdateEffect(() => {
    if (endDate && hoveredDate) {
      setHoveredDate(null);
    }
  }, [endDate]);

  const onDateFocus = useCallback(
    (date: Date) => {
      setFocusedDate(date);

      if (!focusedDate || (focusedDate && !isSameMonth(date, focusedDate))) {
        setActiveMonths(getActiveMonths(numberOfMonths, date));
      }
    },
    [focusedDate, numberOfMonths],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        (e.key === "ArrowRight" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowDown" ||
          e.key === "ArrowUp") &&
        !focusedDate
      ) {
        const activeMonth = activeMonths[0];
        onDateFocus(activeMonth.date);
        setActiveMonths(getActiveMonths(numberOfMonths, activeMonth.date));
      }
    },
    [activeMonths, focusedDate, numberOfMonths, onDateFocus],
  );

  const disabledDatesByUser = useCallback(
    (date: Date) => {
      return (
        isInUnavailableDates(date, unavailableDates) ||
        isDateBlockedChecker({ date, startDate, endDate })
      );
    },
    [isDateBlockedChecker, unavailableDates],
  );

  const isDateSelected = useCallback(
    (date: Date) => isDateSelectedFn(date, startDate, endDate),
    [endDate, startDate],
  );

  const isFirstSelectedDate = useCallback(
    (date: Date) => isFirstSelectedDateFn(date, startDate),
    [startDate],
  );

  const isLastSelectedDate = useCallback(
    (date: Date) => isLastSelectedDateFn(date, endDate),
    [endDate],
  );

  const isStartDate = useCallback(
    (date: Date) => isStartDateFn(date, startDate),
    [startDate],
  );

  const isEndDate = useCallback(
    (date: Date) => isEndDateFn(date, endDate),
    [endDate],
  );

  const isFirstDifferentLastDate = useCallback(
    () => isFirstDifferentLastDateFn(startDate, endDate),
    [endDate, startDate],
  );

  const isDateBlocked = useCallback(
    (date: Date) =>
      isDateBlockedFn({
        date,
        activeMonths,
        minBookingDate,
        maxBookingDate,
        startDate,
        endDate,
        minBookingDays,
        isDateBlockedFn: disabledDatesByUser,
        isOtherMonthsBlocked,
      }),
    [
      disabledDatesByUser,
      activeMonths,
      endDate,
      maxBookingDate,
      minBookingDate,
      minBookingDays,
      startDate,
      isOtherMonthsBlocked,
    ],
  );

  const isDateFocused = useCallback(
    (date: Date) => (focusedDate ? isSameDay(date, focusedDate) : false),
    [focusedDate],
  );

  const isCurrentHoveredDate = useCallback(
    (date: Date) => (hoveredDate ? isSameDay(date, hoveredDate) : false),
    [hoveredDate],
  );

  const isHoveredAfterStartDate = useCallback(
    (date: Date) =>
      hoveredDate && startDate && isBefore(startDate, hoveredDate)
        ? isSameDay(date, hoveredDate)
        : false,
    [hoveredDate],
  );

  const isDateHovered = useCallback(
    (date: Date) =>
      isDateHoveredFn({
        date,
        hoveredDate,
        startDate,
        endDate,
        minBookingDays,
        exactMinBookingDays,
        isDateBlocked: disabledDatesByUser,
      }),
    [
      disabledDatesByUser,
      endDate,
      exactMinBookingDays,
      hoveredDate,
      minBookingDays,
      startDate,
    ],
  );

  const onResetDates = useCallback(() => {
    onDatesChange({
      startDate: null,
      endDate: null,
      focusedInput: START_DATE,
    });
  }, [onDatesChange]);

  const onDateSelect = useCallback(
    (date: Date) => {
      if (
        (focusedInput === END_DATE || focusedInput === START_DATE) &&
        minBookingDays > 0 &&
        exactMinBookingDays &&
        canSelectRange({
          minBookingDays,
          exactMinBookingDays,
          minBookingDate,
          maxBookingDate,
          isDateBlocked: disabledDatesByUser,
          startDate: date,
          endDate: null,
        })
      ) {
        onDatesChange({
          startDate: date,
          endDate: addDays(date, minBookingDays - 1),
          focusedInput: null,
        });
      } else if (
        ((focusedInput === END_DATE &&
          startDate &&
          isBefore(date, startDate)) ||
          (focusedInput === START_DATE && endDate && isAfter(date, endDate))) &&
        !exactMinBookingDays &&
        canSelectRange({
          minBookingDays,
          isDateBlocked: disabledDatesByUser,
          startDate: date,
          endDate: null,
        })
      ) {
        onDatesChange({
          endDate: null,
          startDate: date,
          focusedInput: END_DATE,
        });
      } else if (
        focusedInput === START_DATE &&
        !exactMinBookingDays &&
        canSelectRange({
          minBookingDays,
          isDateBlocked: disabledDatesByUser,
          endDate,
          startDate: date,
        })
      ) {
        onDatesChange({
          endDate: null,
          startDate: date,
          focusedInput: END_DATE,
        });
      } else if (
        focusedInput === START_DATE &&
        !exactMinBookingDays &&
        canSelectRange({
          minBookingDays,
          isDateBlocked: disabledDatesByUser,
          endDate: null,
          startDate: date,
        })
      ) {
        onDatesChange({
          endDate: null,
          startDate: date,
          focusedInput: END_DATE,
        });
      } else if (
        focusedInput === END_DATE &&
        startDate &&
        !isBefore(date, startDate) &&
        !exactMinBookingDays &&
        canSelectRange({
          minBookingDays,
          isDateBlocked: disabledDatesByUser,
          startDate,
          endDate: date,
        })
      ) {
        onDatesChange({
          startDate,
          endDate: date,
          focusedInput: null,
        });
      }

      if (
        focusedInput !== END_DATE &&
        (!focusedDate || (focusedDate && !isSameMonth(date, focusedDate))) &&
        changeActiveMonthOnSelect
      ) {
        setActiveMonths(getActiveMonths(numberOfMonths, date));
      }
    },
    [
      changeActiveMonthOnSelect,
      disabledDatesByUser,
      endDate,
      exactMinBookingDays,
      focusedDate,
      focusedInput,
      maxBookingDate,
      minBookingDate,
      minBookingDays,
      numberOfMonths,
      onDatesChange,
      startDate,
    ],
  );

  const onDateHover = useCallback(
    (date: Date | null) => {
      if (!date) {
        return setHoveredDate(null);
      }

      const isNotBlocked =
        !isDateBlocked(date) || (startDate && isSameDay(date, startDate));
      const isHoveredDateAfterOrEqualMinDate = minBookingDate
        ? !isBefore(date, addDays(minBookingDate, -1))
        : true;
      const isHoveredDateBeforeOrEqualMaxDate = maxBookingDate
        ? !isAfter(date, maxBookingDate)
        : true;

      // Exact minimal booking days
      const potentialEndDate = addDays(date, minBookingDays - 1);
      const isPotentialEndDateAfterOrEqualMinDate = minBookingDate
        ? !isBefore(potentialEndDate, minBookingDate)
        : true;
      const isPotentialEndDateBeforeOrEqualMaxDate = maxBookingDate
        ? !isAfter(potentialEndDate, maxBookingDate)
        : true;
      const isExactAndInRange =
        exactMinBookingDays &&
        minBookingDays > 1 &&
        isHoveredDateAfterOrEqualMinDate &&
        isHoveredDateBeforeOrEqualMaxDate &&
        isPotentialEndDateAfterOrEqualMinDate &&
        isPotentialEndDateBeforeOrEqualMaxDate;

      // Is date in range
      const isInRange =
        startDate &&
        !endDate &&
        !exactMinBookingDays &&
        isHoveredDateAfterOrEqualMinDate &&
        isHoveredDateBeforeOrEqualMaxDate;

      // Is start date hovered and in range
      const isMinBookingDaysInRange =
        minBookingDays > 1 && startDate
          ? isWithinRange(date, {
              start: startDate,
              end: addDays(startDate, minBookingDays - 2),
            })
          : true;

      const isStartDateHoveredAndInRange =
        startDate && isSameDay(date, startDate) && isMinBookingDaysInRange;

      if (
        isNotBlocked &&
        (isExactAndInRange || isInRange || isStartDateHoveredAndInRange)
      ) {
        setHoveredDate(date);
      } else if (hoveredDate !== null) {
        setHoveredDate(null);
      }
    },
    [
      endDate,
      exactMinBookingDays,
      hoveredDate,
      isDateBlocked,
      maxBookingDate,
      minBookingDate,
      minBookingDays,
      startDate,
    ],
  );

  const goToPreviousMonths = useCallback(() => {
    setActiveMonths(getNextActiveMonth(activeMonths, numberOfMonths, -1));
    setFocusedDate(null);
  }, [activeMonths, numberOfMonths]);

  const goToPreviousMonthsByOneMonth = useCallback(() => {
    setActiveMonths(getNextActiveMonth(activeMonths, numberOfMonths, -1, 1));
    setFocusedDate(null);
  }, [activeMonths, numberOfMonths]);

  const goToNextMonths = useCallback(() => {
    setActiveMonths(getNextActiveMonth(activeMonths, numberOfMonths, 1));
    setFocusedDate(null);
  }, [activeMonths, numberOfMonths]);

  const goToNextMonthsByOneMonth = useCallback(() => {
    setActiveMonths(getNextActiveMonth(activeMonths, numberOfMonths, 1, 1));
    setFocusedDate(null);
  }, [activeMonths, numberOfMonths]);

  const goToDate = useCallback(
    (date: Date) => {
      setActiveMonths(getActiveMonths(numberOfMonths, date));
      setFocusedDate(null);
    },
    [numberOfMonths],
  );

  const goToPreviousYear = useCallback(
    (numYears = 1) => {
      setActiveMonths(
        getNextActiveMonth(
          activeMonths,
          numberOfMonths,
          -(numYears * 12 - numberOfMonths + 1),
        ),
      );
      setFocusedDate(null);
    },
    [activeMonths, numberOfMonths],
  );

  const goToNextYear = useCallback(
    (numYears = 1) => {
      setActiveMonths(
        getNextActiveMonth(
          activeMonths,
          numberOfMonths,
          numYears * 12 - numberOfMonths + 1,
        ),
      );
      setFocusedDate(null);
    },
    [activeMonths, numberOfMonths],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.addEventListener) {
        window.addEventListener("keydown", handleKeyDown);
      }
    }

    return () => {
      if (window.removeEventListener) {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  });

  useUpdateEffect(() => {
    if (startDate && position === "from") {
      setActiveMonths(getActiveMonths(numberOfMonths, startDate));
    }
  }, [startDate]);

  useUpdateEffect(() => {
    if (endDate && position === "to") {
      setActiveMonths(getActiveMonths(numberOfMonths, endDate));
    }
  }, [endDate]);

  const onAddActiveDate = useCallback(
    ({ month, year }: IOnAddActiveDate) => {
      if (numberOfMonths < 2) {
        const date = setYear(setMonth(activeMonths[0].date, month), year);

        setActiveMonths(getActiveMonths(numberOfMonths, date));
      }
    },
    [activeMonths, numberOfMonths],
  );

  return {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isCurrentHoveredDate,
    isHoveredAfterStartDate,
    isDateHovered,
    isFirstSelectedDate,
    isLastSelectedDate,
    isFirstDifferentLastDate,
    isStartDate,
    isEndDate,
    isDateBlocked,
    numberOfMonths,
    isDateFocused,
    focusedDate,
    hoveredDate,
    onResetDates,
    onDateHover,
    onDateSelect,
    onDateFocus,
    onAddActiveDate,
    goToPreviousMonths,
    goToPreviousMonthsByOneMonth,
    goToNextMonths,
    goToNextMonthsByOneMonth,
    goToDate,
    goToPreviousYear,
    goToNextYear,
  };
};
