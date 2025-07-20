import {
  IDatePresetButtonValues,
  IDatePresetSelectValues,
} from "../Datepicker/types";

export const DATE_PRESET_BUTTONS = [
  { label: "Current day", value: "days", variant: "current" },
  { label: "Previous day", value: "days", variant: "prev" },
  { label: "Current week", value: "weeks", variant: "current" },
  { label: "Previous week", value: "weeks", variant: "prev" },
  { label: "Current month", value: "months", variant: "current" },
  { label: "Previous month", value: "months", variant: "prev" },
  { label: "Current year", value: "years", variant: "current" },
  { label: "Previous year", value: "years", variant: "prev" },
] as IDatePresetButtonValues[];

export const translationConfig = {
  datePresetTitle: "Date Preset",
  datePresetInputPlaceholder: "Input range",
  datePresetSelectPlaceholder: "Select Rage",
  cancelButtonText: "Cancel",
  applyButtonText: "Apply",
  timeLabel: "Time",
  timezonesPlaceholder: "Select Time Zone",
};

export const timePreset = {
  label: "Previous hours",
  value: 2,
  variant: "prev",
  type: "hours",
} as IDatePresetSelectValues;

export const basePresets = [
  {
    label: "Previous days",
    value: 4,
    variant: "prev",
    type: "days",
    maxNumber: 365,
  },
  {
    label: "Previous weeks",
    value: 6,
    variant: "prev",
    type: "weeks",
    maxNumber: 52,
  },
  {
    label: "Previous months",
    value: 8,
    variant: "prev",
    type: "months",
    maxNumber: 12,
  },
  {
    label: "Previous years",
    value: 10,
    variant: "prev",
    type: "years",
    maxNumber: 1,
  },
] as IDatePresetSelectValues[];

export const presetsWithTime = [timePreset, ...basePresets];

export const datePickerInputClasses = {
  input: "DatepickerInput",
};
