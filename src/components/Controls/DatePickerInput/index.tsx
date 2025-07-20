import React, { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

import "./styles.scss";

import { DATE_INPUT_MASK, DATE_MASK, TIMEZONE_MASK } from "@/constants/common";
import { appReactMemo } from "@/hocs/appReactMemo";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { ICONS_MAP } from "@/icons";

import Datepicker from "../Datepicker";
import {
  IDatepickerChildrenProps,
  TDefaultDatepickerProps,
} from "../Datepicker/types";
import Input from "../Input";

import {
  DATE_PRESET_BUTTONS,
  datePickerInputClasses,
  presetsWithTime,
  translationConfig,
} from "./constants";
import { timezones } from "./timezones";

export type TDateValue = { startDate: string };

export interface IDatePickerInput
  extends Omit<TDefaultDatepickerProps, "children"> {
  value?: TDateValue | string | null;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  inputMask?: string;
  valueMask?: string;
  error?: boolean;
  errorMessage?: string;
  endIcon?: React.ReactElement;
  isAutoFocused?: boolean;
  fieldRef?: React.Ref<HTMLInputElement>;
  onBlur?: () => void;
}

interface IInputComponent
  extends Omit<IDatePickerInput, "onChange">,
    Partial<IDatepickerChildrenProps> {}

const InputComponent = ({
  value,
  label,
  placeholder,
  disabled,
  inputMask = DATE_INPUT_MASK,
  error,
  errorMessage,
  setStartDate,
  startDate,
  ...rest
}: IInputComponent) => {
  const calendarValue = value as TDateValue | undefined;

  useUpdateEffect(() => {
    const mask = TIMEZONE_MASK;
    const calendarStartValue = startDate && format(new Date(startDate), mask);

    if (calendarStartValue !== calendarValue?.startDate) {
      setStartDate?.({ value: calendarValue?.startDate || null, format: mask });
    }
  }, [calendarValue]);

  useUpdateEffect(() => {
    if (typeof value === "object" && !value?.startDate) {
      setStartDate?.({ value: null });
    }
  }, [calendarValue?.startDate]);

  const getValue = () => {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      const isDateStart =
        Number(new Date(value)) === new Date(value).setHours(0, 0, 0, 0);

      return format(
        new Date(value),
        inputMask || (isDateStart ? DATE_MASK : TIMEZONE_MASK),
      );
    }
  };

  return (
    <Input
      {...rest}
      readOnly
      label={label}
      placeholder={placeholder}
      value={getValue()}
      disabled={disabled}
      error={error}
      errorMessage={errorMessage}
      classes={{
        input: `${datePickerInputClasses.input}`,
      }}
    />
  );
};

const DatePickerInput = ({
  value,
  label,
  placeholder,
  disabled,
  inputMask,
  valueMask,
  error,
  errorMessage,
  endIcon,
  classes,
  onBlur,
  isAutoFocused,
  config,
  scrollPosition,
  datePresetSelectValues,
  settingsConfig,
  ...restProps
}: IDatePickerInput) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isAutoFocused) {
      onOpen();
    }
  }, [isAutoFocused]);

  const calendarConfig = useMemo(
    () => ({
      datePresetIcon: <ICONS_MAP.CalendarMonthIcon />,
      calendarIcon: <ICONS_MAP.CalendarIcon />,
      rangeDefaultEndOfDay: true,
      initialVisibleMonth: undefined,
      ...config,
    }),
    [config],
  );

  const getDatePresetSelectValues = () => {
    if (datePresetSelectValues) {
      return datePresetSelectValues;
    }

    return presetsWithTime;
  };

  const localSettingsConfig = useMemo(
    () => ({
      hideInputs: true,
      switchedAndZoneTogether: true,
      timezoneOnTop: true,
      datepickerMenuInPopover: false,
      timepickerInPopovers: false,
      hideDefaultEnabledTime: true,
      ...settingsConfig,
    }),
    [settingsConfig],
  );

  const timezonesList = useMemo(
    () =>
      timezones.map(({ name, location }) => ({
        value: name,
        label: location,
      })),
    [],
  );

  const initialDate = useMemo(() => {
    if (!value) {
      return;
    }

    if (typeof value === "string") {
      return {
        start: {
          value,
          format: valueMask || TIMEZONE_MASK,
        },
      };
    }
  }, []);

  const inputProps = {
    label,
    placeholder,
    disabled,
    inputMask,
    error,
    errorMessage,
    value,
    endIcon,
    classes,
    onBlur,
  };

  if (disabled) {
    return (
      <InputComponent {...inputProps} endIcon={<ICONS_MAP.CalendarIcon />} />
    );
  }

  return (
    <Datepicker
      {...restProps}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      locale={enUS}
      initialDate={initialDate}
      timezonesList={timezonesList}
      config={calendarConfig}
      classes={classes}
      translationConfig={translationConfig}
      datePresetButtonsValues={DATE_PRESET_BUTTONS}
      datePresetSelectValues={getDatePresetSelectValues()}
      settingsConfig={localSettingsConfig}
      scrollPosition={scrollPosition}
    >
      {(datepickerProps) => (
        <InputComponent
          {...inputProps}
          {...datepickerProps}
          endIcon={<ICONS_MAP.CalendarIcon />}
        />
      )}
    </Datepicker>
  );
};

export default appReactMemo(DatePickerInput);
