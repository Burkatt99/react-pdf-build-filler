import {
  IDatePresetButtonValues,
  IDatePresetSelectValues,
  IDatesChangeProps,
  START_DATE,
  TIMES_OF_DAY,
} from "../types";

export const defaultDateState: IDatesChangeProps = {
  startDate: null,
  endDate: null,
  focusedInput: START_DATE,
};

export const defaultTimeState = {
  from: {
    hours: null,
    minutes: null,
    seconds: null,
  },
  to: {
    hours: null,
    minutes: null,
    seconds: null,
  },
};

export const rangeEndOfDayDefaultTime = {
  from: {
    hours: "00",
    minutes: "00",
    seconds: "00",
  },
  to: {
    hours: "23",
    minutes: "59",
    seconds: "59",
  },
};

export const defaultTimeTypeState = {
  from: TIMES_OF_DAY.AM,
  to: TIMES_OF_DAY.AM,
};

export const rangeEndOfDayDefaultTimeType = {
  from: TIMES_OF_DAY.AM,
  to: TIMES_OF_DAY.PM,
};

export const hoursList = [
  { label: "01", value: 1 },
  { label: "02", value: 2 },
  { label: "03", value: 3 },
  { label: "04", value: 4 },
  { label: "05", value: 5 },
  { label: "06", value: 6 },
  { label: "07", value: 7 },
  { label: "08", value: 8 },
  { label: "09", value: 9 },
  { label: "10", value: 10 },
  { label: "11", value: 11 },
  { label: "12", value: 12 },
];

export const minutesList = [
  { label: "00", value: 0 },
  { label: "05", value: 5 },
  { label: "10", value: 10 },
  { label: "15", value: 15 },
  { label: "30", value: 30 },
  { label: "45", value: 45 },
];

export const defaultDatePresetSelectValues: IDatePresetSelectValues[] = [
  { label: "Next hours", value: 1, variant: "next", type: "hours" },
  { label: "Previous hours", value: 2, variant: "prev", type: "hours" },
  { label: "Next days", value: 3, variant: "next", type: "days" },
  { label: "Previous days", value: 4, variant: "prev", type: "days" },
  { label: "Next weeks", value: 5, variant: "next", type: "weeks" },
  { label: "Previous weeks", value: 6, variant: "prev", type: "weeks" },
  { label: "Next months", value: 7, variant: "next", type: "months" },
  { label: "Previous months", value: 8, variant: "prev", type: "months" },
  { label: "Next years", value: 9, variant: "next", type: "years" },
  { label: "Previous years", value: 10, variant: "prev", type: "years" },
];

export const defaultDatePresetButtonsValues: IDatePresetButtonValues[] = [
  { label: "Current day", value: "days", variant: "current" },
  { label: "Next day", value: "days", variant: "next" },
  { label: "Previous day", value: "days", variant: "prev" },
  { label: "Current week", value: "weeks", variant: "current" },
  { label: "Next week", value: "weeks", variant: "next" },
  { label: "Previous week", value: "weeks", variant: "prev" },
  { label: "Current month", value: "months", variant: "current" },
  { label: "Next month", value: "months", variant: "next" },
  { label: "Previous month", value: "months", variant: "prev" },
  { label: "Current year", value: "years", variant: "current" },
  { label: "Next year", value: "years", variant: "next" },
  { label: "Previous year", value: "years", variant: "prev" },
];

export const baseSettingsConfig = {
  hideHoveredRange: false,
  disableDatepickerMenu: false,
  disableCloseOnChange: true,
  hideDefaultEnabledTime: false,
  hideControlButtons: false,
  hideDatePreset: false,
  datepickerMenuInPopover: false,
};
