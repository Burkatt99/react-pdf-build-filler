import React from "react";
import { Locale } from "date-fns";

import { ISelectOption } from "../Select/types";
import { TooltipClasses } from "../Tooltip/types";

import { TCalendarClasses } from "./components/Calendar/constants";
import { PopoverMenuClasses } from "./components/Calendar/MenuVariants/PopoverMenu/constants";
import { ControlButtonsClasses } from "./components/ControlButtons/constants";

export type TFocusedInput = "startDate" | "endDate" | null;
export type DateTypes =
  | "years"
  | "months"
  | "weeks"
  | "days"
  | "hours"
  | "minutes";
export type TimeTypes = "hour" | "minute";
export type TCalendarPosition = "from" | "to";
export type DatePresetTypes = "next" | "prev" | "current";

export enum TIMES_OF_DAY {
  AM = "AM",
  PM = "PM",
}

export interface IRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface IDatesChangeProps extends IRange {
  focusedInput: TFocusedInput;
}

export interface IGetDaysProps {
  year: number;
  month: number;
  dayLabelFormat?(date: Date): string;
  firstDayOfWeek?: FirstDayOfWeek;
  showPrevNextMonthDates?: boolean;
}

export interface IGetWeekdayLabelsProps {
  firstDayOfWeek?: FirstDayOfWeek;
  weekdayLabelFormat?(date: Date, locale?: Locale): string;
  locale?: Locale;
}

export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const START_DATE = "startDate";
export const END_DATE = "endDate";
export const AMOUNT_YEARS = 12;

export const MAX_TIME_LIMITS = {
  hour12format: 12,
  hour24format: 23,
  min: 59,
  sec: 59,
};

export interface IUseMonthProps extends IGetWeekdayLabelsProps, IGetDaysProps {
  monthLabelFormat?(date: Date, locale?: Locale): string;
  showPrevNextMonthDates?: boolean;
}

export interface MonthType {
  year: number;
  month: number;
  date: Date;
}

type TSetDateValue = { value: string | null; format?: string; date?: never };
type TSetDate = { value?: never; format?: never; date: Date };
export type TSetDateProps = TSetDateValue | TSetDate;

export interface IDatepickerChildrenProps extends IRange {
  setStartDate: (props: TSetDateProps) => void;
}

export interface ICalendar {
  position: TCalendarPosition;
  classes?: TCalendarClasses;
}

export interface IDatepickerConfig {
  datePresetIcon?: React.ReactElement;
  calendarIcon?: React.ReactElement;
  returnTimeZonedDate?: boolean;
  initialVisibleMonth?: Date;
  rangeDefaultEndOfDay?: boolean;
  initialAsEndMonth?: boolean;
  use24HourFormat?: boolean;
}

export interface ITranslationConfig {
  datePresetTitle?: string;
  datePresetInputPlaceholder?: string;
  datePresetSelectPlaceholder?: string;
  fromInputPlaceholder?: string;
  toInputPlaceholder?: string;
  cancelButtonText?: string;
  applyButtonText?: string;
  timeLabel?: string;
  timezonesPlaceholder?: string;
  hourTimeLabel?: string;
  minutesTimeLabel?: string;
  secondsTimeLabel?: string;
}

export interface ISettingsConfig {
  hideHoveredRange?: boolean;
  disableDatepickerMenu?: boolean;
  disableCloseOnChange?: boolean;
  hideDefaultEnabledTime?: boolean;
  hideControlButtons?: boolean;
  hideDatePreset?: boolean;
  timezoneOnTop?: boolean;
  datepickerMenuInPopover?: boolean;
  timepickerInPopovers?: boolean;
  clearTimezoneAfterSaveDate?: boolean;
  timezoneFallbackAfterCancelDate?: string;
}

export interface IInitialDate {
  start: TSetDateProps;
}

export type IDateBlockerChecker = (props: {
  date: Date;
  startDate: Date | null;
  endDate: Date | null;
}) => boolean;

export type TDatePickerClasses = Partial<{
  container: string;
  footer: string;
  header: string;
  controlButtons: ControlButtonsClasses;
  tooltip: TooltipClasses;
  calendar: TCalendarClasses;
  popoverMenu: PopoverMenuClasses;
}>;

export type TDefaultDatepickerProps = {
  children?: (state: IDatepickerChildrenProps) => React.ReactElement;
  classes?: TDatePickerClasses;
  locale?: Locale;
  startDayOfWeek?: FirstDayOfWeek;
  minYear?: number;
  maxYear?: number;
  onChange: (startDate: string) => void;
  onChangeTimezone?: (timezone: string) => void;
  isDateBlockedChecker?: IDateBlockerChecker;
  timezonesList?: ISelectOption[];
  datePresetSelectValues?: IDatePresetSelectValues[];
  datePresetButtonsValues?: IDatePresetButtonValues[];
  config?: IDatepickerConfig;
  translationConfig?: ITranslationConfig;
  settingsConfig?: ISettingsConfig;
  initialDate?: IInitialDate;
  initialTimeZone?: string;
  portalContainer?: Element | null;
  scrollPosition?: number;
  popoverDirection?: "top" | "bottom";
};

type TTooltipDatepickerProps = TDefaultDatepickerProps & {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

type TCalendarProps = TDefaultDatepickerProps & {
  disableTooltip: boolean;
  open?: never;
  onOpen?: never;
  onClose?: never;
};

export type IDatepickerProps = TTooltipDatepickerProps | TCalendarProps;

export interface IOnAddActiveDate {
  month: number;
  year: number;
}

export interface ITimesItem {
  label: string;
  value: number;
}

export interface ITimePart {
  hours: string | null;
  minutes: string | null;
  seconds: string | null;
}

export interface ITime {
  from: ITimePart;
  to: ITimePart;
}

export interface ITimeType {
  from: TIMES_OF_DAY;
  to: TIMES_OF_DAY;
}

export interface DatePresetType {
  timeType: DateTypes;
  number: number;
  variant: DatePresetTypes;
}

export interface IDatePresetSelectValues {
  label: string;
  value: number | string;
  variant: DatePresetTypes;
  type: DateTypes;
  maxNumber?: number;
}

export interface IDatePresetButtonValues {
  label: string;
  value: DateTypes;
  variant: DatePresetTypes;
}
