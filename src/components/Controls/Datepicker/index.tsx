import React, { useRef } from "react";
import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";

import Tooltip from "../Tooltip";

import Calendar from "./components/Calendar";
import ControlButtons from "./components/ControlButtons";
import DatepickerHeader from "./containers/DatepickerHeader";
import {
  baseSettingsConfig,
  defaultDatePresetButtonsValues,
  defaultDatePresetSelectValues,
} from "./helpers/values";

import { datepickerClasses } from "./constants";
import { DatepickerContextProvider } from "./datepickerContext";
import { IDatepickerProps } from "./types";
import { useDateChange } from "./useDateChange";

const Datepicker = ({
  children,
  classes,
  locale,
  startDayOfWeek,
  open,
  onOpen,
  onClose,
  onChange,
  onChangeTimezone,
  minYear = 1900,
  maxYear = 2100,
  datePresetButtonsValues = defaultDatePresetButtonsValues,
  datePresetSelectValues = defaultDatePresetSelectValues,
  config = {},
  translationConfig = {},
  settingsConfig = {},
  initialDate,
  initialTimeZone,
  scrollPosition,
  isDateBlockedChecker,
}: IDatepickerProps) => {
  const datepickerSettings = React.useMemo(
    () => ({ ...baseSettingsConfig, ...settingsConfig }),
    [settingsConfig],
  );

  const { hideControlButtons, disableCloseOnChange, hideDefaultEnabledTime } =
    datepickerSettings;

  const {
    state,
    handleDateChange,
    setDate,
    onSelectTimezone,
    timezone,
    handleTimeChange,
    setHour,
    setMinute,
    setSeconds,
    setFullTime,
    setTimeOfDay,
    time,
    timeType,
    onCancelDate,
    onApplyDate,
    isTimeVisible,
    timeHandlerOn,
    timeVisibilityHandler,
  } = useDateChange({
    onClose,
    onChange,
    onChangeTimezone,
    hideControlButtons,
    disableCloseOnChange,
    returnTimeZonedDate: config?.returnTimeZonedDate,
    hideDefaultEnabledTime,
    initialDate,
    initialTimeZone,
    rangeDefaultEndOfDay: config?.rangeDefaultEndOfDay,
    use24HourFormat: config?.use24HourFormat,
    clearTimezoneAfterSaveDate: settingsConfig?.clearTimezoneAfterSaveDate,
    timezoneFallbackAfterCancelDate:
      settingsConfig?.timezoneFallbackAfterCancelDate,
  });

  const contextValue = React.useMemo(() => {
    return {
      state,
      time,
      timeType,
      timezone,
      locale,
      isTimeVisible,
      datePresetSelectValues,
      datePresetButtonsValues,
      startDayOfWeek,
      minYear,
      maxYear,
      classes,
      handleTimeChange,
      handleDateChange,
      setHour,
      setMinute,
      setSeconds,
      setFullTime,
      setTimeOfDay,
      onSelectTimezone,
      onCancelDate,
      onApplyDate,
      config,
      translationConfig,
      datepickerSettings,
      timeHandlerOn,
      timeVisibilityHandler,
      isDateBlockedChecker,
    };
  }, [
    state,
    time,
    timeType,
    timezone,
    locale,
    isTimeVisible,
    datePresetSelectValues,
    datePresetButtonsValues,
    startDayOfWeek,
    classes,
    handleTimeChange,
    handleDateChange,
    setHour,
    setMinute,
    setSeconds,
    setFullTime,
    setTimeOfDay,
    onSelectTimezone,
    onCancelDate,
    onApplyDate,
    config,
    translationConfig,
    datepickerSettings,
    timeHandlerOn,
    timeVisibilityHandler,
    minYear,
    maxYear,
    isDateBlockedChecker,
  ]);

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const DatePickerComponent = (
    <div
      className={cn(datepickerClasses.container, classes?.container)}
      ref={containerRef}
    >
      <DatepickerContextProvider value={contextValue}>
        <DatepickerHeader className={classes?.header} />

        <Calendar position="from" classes={classes?.calendar} />
        <div className={cn(datepickerClasses.footer, classes?.footer)}>
          {!hideControlButtons && (
            <ControlButtons classes={classes?.controlButtons} />
          )}
        </div>
      </DatepickerContextProvider>
    </div>
  );

  if (!children) {
    return null;
  }

  return (
    <Tooltip
      content={DatePickerComponent}
      defaultPlacement="bottom"
      trigger="click"
      open={open}
      onOpen={onOpen}
      scrollPosition={scrollPosition}
      classes={{
        content: `${datepickerClasses.tooltip} ${classes?.tooltip?.content}`,
        arrow: `${datepickerClasses.arrow} ${classes?.tooltip?.arrow}`,
        wrapper: `${datepickerClasses.wrapper} ${classes?.tooltip?.wrapper}`,
      }}
    >
      <div ref={inputWrapperRef}>
        {children({
          setStartDate: setDate("start"),
          startDate: state.startDate,
          endDate: state.endDate,
        })}
      </div>
    </Tooltip>
  );
};

export default appReactMemo(Datepicker);
