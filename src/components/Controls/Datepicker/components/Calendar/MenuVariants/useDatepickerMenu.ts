import { useCallback, useMemo, useState } from "react";

import { useDatePickerContext } from "../../../datepickerContext";
import {
  getMonthsList,
  getYearsList,
  IMonthsList,
} from "../../../helpers/utils";
import { AMOUNT_YEARS } from "../../../types";
import { useCalendarContext } from "../calendarContext";
import { TCalendarClasses } from "../constants";

interface IUseDatepickerMenu {
  yearsAmount?: number;
  reversed?: boolean;
}

export interface IUseDatepickerMenuResult {
  monthList: IMonthsList[];
  onSelectMonth: (month: number) => void;
  selectedMonth: number;
  yearsList: number[];
  onSelectYear: (year: number) => void;
  selectedYear: number;
  classes?: TCalendarClasses;
  onIncrementYears: () => void;
  onDecrementYears: () => void;
  onSetActiveDate: () => void;
}

export const useDatepickerMenu = ({
  yearsAmount = AMOUNT_YEARS,
  reversed,
}: IUseDatepickerMenu): IUseDatepickerMenuResult => {
  const { activeMonths, onAddActiveDate, locale } = useCalendarContext();
  const { minYear, maxYear } = useDatePickerContext();

  const [selectedMonth, setSelectedMonth] = useState(activeMonths[0].month);
  const [selectedYear, setSelectedYear] = useState(activeMonths[0].year);
  const [currentYear, setCurrentYear] = useState(activeMonths[0].year);

  const monthList = useMemo(() => getMonthsList(locale), [locale]);
  const yearsList = useMemo(
    () => getYearsList({ year: currentYear, yearsAmount, reversed }),
    [currentYear],
  );

  const onSelectMonth = useCallback((month: number) => {
    setSelectedMonth(month);
  }, []);

  const onSelectYear = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const onIncrementYears = useCallback(() => {
    let newYear = currentYear + yearsAmount;
    if (newYear > maxYear) {
      newYear = maxYear;
    }
    setCurrentYear(newYear);
  }, [currentYear, maxYear]);

  const onDecrementYears = useCallback(() => {
    let newYear = currentYear - yearsAmount;
    if (newYear <= minYear) {
      newYear = minYear + (yearsAmount - 1);
    }
    setCurrentYear(newYear);
  }, [currentYear, minYear]);

  const onSetActiveDate = useCallback(() => {
    onAddActiveDate({ month: selectedMonth, year: selectedYear });
  }, [selectedMonth, selectedYear]);

  return {
    monthList,
    yearsList,
    onSelectMonth,
    onSelectYear,
    selectedMonth,
    selectedYear,
    onIncrementYears,
    onDecrementYears,
    onSetActiveDate,
  };
};
