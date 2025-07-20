import React from "react";
import { Locale } from "date-fns";

import {
  defaultDateState,
  defaultTimeState,
  defaultTimeTypeState,
} from "./helpers/values";

import {
  FirstDayOfWeek,
  IDateBlockerChecker,
  IDatepickerConfig,
  IDatePresetButtonValues,
  IDatePresetSelectValues,
  IDatesChangeProps,
  IRange,
  ISettingsConfig,
  ITime,
  ITimePart,
  ITimeType,
  ITranslationConfig,
  TCalendarPosition,
  TIMES_OF_DAY,
} from "./types";

export interface IDatepickerContextDefaultValue {
  state: IDatesChangeProps;
  className?: string;
  time: ITime;
  timeType: ITimeType;
  timezone: string;
  locale?: Locale;
  minYear: number;
  maxYear: number;
  isTimeVisible: boolean;
  datePresetSelectValues: IDatePresetSelectValues[];
  datePresetButtonsValues: IDatePresetButtonValues[];
  startDayOfWeek?: FirstDayOfWeek;
  handleDateChange: (data: IDatesChangeProps) => void;
  handleTimeChange: (data: IRange) => void;
  setHour: (hour: string, type: TCalendarPosition) => void;
  setMinute: (minutes: string, type: TCalendarPosition) => void;
  setSeconds: (seconds: string, type: TCalendarPosition) => void;
  setFullTime: (time: ITimePart, type: TCalendarPosition) => void;
  setTimeOfDay: (timeOfDay: TIMES_OF_DAY, type: TCalendarPosition) => void;
  onSelectTimezone: (value: string) => void;
  onCancelDate: () => void;
  onApplyDate: () => void;
  config?: IDatepickerConfig;
  translationConfig: ITranslationConfig;
  datepickerSettings: ISettingsConfig;
  timeHandlerOn: {
    from: boolean;
    to: boolean;
  };
  timeVisibilityHandler: (key: "from", value: boolean) => void;
  isDateBlockedChecker?: IDateBlockerChecker;
}

export const datepickerContextDefaultValue: IDatepickerContextDefaultValue = {
  state: defaultDateState,
  time: defaultTimeState,
  timeType: defaultTimeTypeState,
  timezone: "",
  minYear: 1900,
  maxYear: 2100,
  isTimeVisible: true,
  datePresetSelectValues: [],
  datePresetButtonsValues: [],
  handleDateChange: () => {},
  handleTimeChange: () => {},
  setHour: () => {},
  setMinute: () => {},
  setSeconds: () => {},
  setFullTime: () => {},
  setTimeOfDay: () => {},
  onSelectTimezone: () => {},
  onCancelDate: () => {},
  onApplyDate: () => {},
  config: {},
  translationConfig: {},
  datepickerSettings: {},
  timeHandlerOn: { from: false, to: false },
  timeVisibilityHandler: () => {},
  isDateBlockedChecker: () => false,
};

export const DatepickerContext = React.createContext(
  datepickerContextDefaultValue,
);

export const DatepickerContextProvider = DatepickerContext.Provider;

export const useDatePickerContext = (): IDatepickerContextDefaultValue =>
  React.useContext(DatepickerContext);
