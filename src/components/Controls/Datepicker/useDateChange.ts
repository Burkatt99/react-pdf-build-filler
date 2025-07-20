import React, { useCallback, useState } from "react";
import { format, getHours, getMinutes, getSeconds, parse, set } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { useUpdateEffect } from "@/hooks/useUpdateEffect";

import {
  dateToZeroUtc,
  getInitialDate,
  getInitialTime,
  getInitialTimeType,
  getTimeZonedDate,
  parseAndFormatTime,
} from "./helpers/utils";
import {
  defaultDateState,
  defaultTimeState,
  defaultTimeTypeState,
  rangeEndOfDayDefaultTime,
  rangeEndOfDayDefaultTimeType,
} from "./helpers/values";

import {
  END_DATE,
  IDatesChangeProps,
  IInitialDate,
  IRange,
  ITime,
  ITimePart,
  ITimeType,
  START_DATE,
  TCalendarPosition,
  TIMES_OF_DAY,
  TSetDateProps,
} from "./types";

type InputVariantType = "start" | "end";
interface IUseDateChangeProps {
  onClose?: () => void;
  onChange: (startDate: string) => void;
  onChangeTimezone?: (timezone: string) => void;
  hideControlButtons?: boolean;
  disableCloseOnChange?: boolean;
  returnTimeZonedDate?: boolean;
  hideDefaultEnabledTime?: boolean;
  initialDate?: IInitialDate;
  initialTimeZone?: string;
  rangeDefaultEndOfDay?: boolean;
  clearTimezoneAfterSaveDate?: boolean;
  timezoneFallbackAfterCancelDate?: string;
  disableDatepickerTooltip?: boolean;
  use24HourFormat?: boolean;
}

interface IUseDateChangeResult {
  state: IDatesChangeProps;
  handleDateChange: (data: IDatesChangeProps) => void;
  handleTimeChange: (data: IRange) => void;
  setDate: (inputVariant: InputVariantType) => (props: TSetDateProps) => void;
  onSelectTimezone: (value: string) => void;
  timezone: string;
  setHour: (hour: string, type: TCalendarPosition) => void;
  setMinute: (minute: string, type: TCalendarPosition) => void;
  setSeconds: (seconds: string, type: TCalendarPosition) => void;
  setFullTime: (time: ITimePart, type: TCalendarPosition) => void;
  setTimeOfDay: (timeOfDay: TIMES_OF_DAY, type: TCalendarPosition) => void;
  time: ITime;
  timeType: ITimeType;
  onCancelDate: () => void;
  onApplyDate: () => void;
  handleClose: () => void;
  isTimeVisible: boolean;
  timeHandlerOn: {
    from: boolean;
    to: boolean;
  };
  timeVisibilityHandler: (key: string, value: boolean) => void;
  disableTimeHandler: (e: React.ChangeEvent) => void;
}

export const useDateChange = ({
  onClose,
  onChange,
  onChangeTimezone,
  hideControlButtons,
  disableCloseOnChange,
  returnTimeZonedDate,
  hideDefaultEnabledTime,
  initialDate,
  initialTimeZone,
  rangeDefaultEndOfDay,
  clearTimezoneAfterSaveDate,
  timezoneFallbackAfterCancelDate = "",
  disableDatepickerTooltip,
  use24HourFormat,
}: IUseDateChangeProps): IUseDateChangeResult => {
  const [state, setState] = useState<IDatesChangeProps>(
    getInitialDate(initialDate, initialTimeZone),
  );
  const [time, setTime] = useState<ITime>(
    getInitialTime(initialDate, rangeDefaultEndOfDay, initialTimeZone),
  ); // time in 24 format
  const [timeType, setTimeType] = useState(
    getInitialTimeType(initialDate, rangeDefaultEndOfDay, initialTimeZone),
  );
  const [timezone, setTimezone] = useState(initialTimeZone || "");
  const [isTimeVisible, setIsTimeVisible] = useState(!hideDefaultEnabledTime);
  const [timeHandlerOn, setTimeHandlerOn] = useState({
    from: false,
    to: false,
  });

  useUpdateEffect(() => {
    setState(defaultDateState);
    setTime(defaultTimeState);
    setTimeType(defaultTimeTypeState);
    setTimezone("");
  }, []);

  useUpdateEffect(() => {
    if (!isTimeVisible) {
      setTimeHandlerOn({
        from: false,
        to: false,
      });
    }
  }, [isTimeVisible]);

  const timeVisibilityHandler = useCallback((key: string, value: boolean) => {
    setTimeHandlerOn((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  const disableTimeHandler = useCallback((e: any) => {
    const { checked } = e.target;

    setIsTimeVisible(checked);

    if (!checked) {
      setTime({
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
      });

      setTimeType({
        from: TIMES_OF_DAY.AM,
        to: TIMES_OF_DAY.PM,
      });
    }
  }, []);

  const applyDate = useCallback(() => {
    const fromDate =
      state.startDate &&
      set(state.startDate, {
        hours: time.from.hours ? Number(time.from.hours) : undefined,
        minutes: time.from.minutes ? Number(time.from.minutes) : undefined,
        seconds: time.from.seconds ? Number(time.from.seconds) : undefined,
      });

    const normalizer = returnTimeZonedDate ? getTimeZonedDate : dateToZeroUtc;
    onChange(
      normalizer({
        date: fromDate,
        timezone: isTimeVisible || initialTimeZone ? timezone : "",
      }),
    );
  }, [state, time, timezone, isTimeVisible, onChange]);

  const onApplyDate = useCallback(() => {
    applyDate();

    setTimeHandlerOn({
      from: false,
      to: false,
    });

    if (clearTimezoneAfterSaveDate) {
      setTimezone("");
    }

    onClose?.();
  }, [applyDate, clearTimezoneAfterSaveDate, onClose]);

  const handleClose = useCallback(() => {
    if (hideControlButtons) {
      onApplyDate();
    } else {
      onClose?.();
    }
  }, [onApplyDate, hideControlButtons, onClose]);

  const handleDateChange = useCallback((data: Partial<IDatesChangeProps>) => {
    if (!data.focusedInput) {
      setState((state) => ({
        ...state,
        ...data,
        focusedInput: START_DATE,
      }));
    } else {
      setState((state) => ({ ...state, ...data }));
    }
  }, []);

  const handleTimeChange = useCallback(
    ({ startDate, endDate }: Partial<IRange>) => {
      if (startDate && endDate) {
        setTime({
          from: {
            hours: String(getHours(startDate)),
            minutes: String(getMinutes(startDate)),
            seconds: String(getSeconds(startDate)),
          },
          to: {
            hours: String(getHours(endDate)),
            minutes: String(getMinutes(endDate)),
            seconds: String(getSeconds(endDate)),
          },
        });

        setTimeType({
          from: format(startDate, "a") as TIMES_OF_DAY,
          to: format(endDate, "a") as TIMES_OF_DAY,
        });
      }
    },
    [],
  );

  const onSelectTimezone = useCallback((timezone: string) => {
    setTimezone(timezone);
    onChangeTimezone?.(timezone);
  }, []);

  const setHour = useCallback(
    (hour: string, type: TCalendarPosition) => {
      setTime((state) => ({
        ...state,
        [type]: {
          hours: parseAndFormatTime(`${hour} ${timeType[type]}`, "hh a", "HH"),
          minutes: state[type].minutes || "00",
          seconds: state[type].seconds || "00",
        },
      }));
    },
    [timeType],
  );

  const setMinute = useCallback((minutes: string, type: TCalendarPosition) => {
    setTime((state) => ({
      ...state,
      [type]: {
        hours: state[type].hours || "00",
        minutes: parseAndFormatTime(minutes, "m", "mm"),
        seconds: state[type].seconds || "00",
      },
    }));
  }, []);

  const setSeconds = useCallback((seconds: string, type: TCalendarPosition) => {
    setTime((state) => ({
      ...state,
      [type]: {
        hours: state[type].hours || "00",
        minutes: state[type].minutes || "00",
        seconds: parseAndFormatTime(seconds, "s", "ss"),
      },
    }));
  }, []);

  const setFullTime = useCallback(
    (time: ITimePart, type: TCalendarPosition) => {
      const { hours, minutes, seconds } = time;

      let normalizedHours;
      if (use24HourFormat) {
        normalizedHours = hours;
      } else {
        normalizedHours = parseAndFormatTime(
          `${hours === "00" ? "12" : hours} ${timeType[type]}`,
          "hh a",
          "HH",
        );
      }

      setTime((state) => ({
        ...state,
        [type]: {
          hours: hours ? normalizedHours : null,
          minutes: minutes ? parseAndFormatTime(minutes, "m", "mm") : null,
          seconds: seconds ? parseAndFormatTime(seconds, "s", "ss") : null,
        },
      }));
    },
    [timeType],
  );

  const setTimeOfDay = useCallback(
    (timeOfDay: TIMES_OF_DAY, type: TCalendarPosition) => {
      const normalizeHours = parseAndFormatTime(
        time[type].hours || "00",
        "HH",
        "KK",
      );

      setTime({
        ...time,
        [type]: {
          hours: parseAndFormatTime(
            `${normalizeHours} ${timeOfDay}`,
            "KK a",
            "HH",
          ),
          minutes: time[type].minutes || "00",
          seconds: time[type].seconds || "00",
        },
      });
      setTimeType({ ...timeType, [type]: timeOfDay });
    },
    [time, timeType],
  );

  const setDate = useCallback(
    (inputVariant: InputVariantType) => {
      return ({ date, value, format: dateFormat }: TSetDateProps) => {
        if (value === null || !dateFormat) {
          setTime(defaultTimeState);
          setTimeType(defaultTimeTypeState);
          handleDateChange({
            startDate: null,
            endDate: null,
            focusedInput: null,
          });

          const { from, to } = getInitialTime(undefined, true);

          if (inputVariant === "start") {
            setTime((state) => ({
              ...state,
              from: rangeDefaultEndOfDay ? from : defaultTimeState.from,
            }));
            setTimeType((state) => ({ ...state, from: TIMES_OF_DAY.AM }));
            return handleDateChange({
              startDate: null,
              focusedInput: END_DATE,
            });
          }

          setTime((state) => ({
            ...state,
            to: rangeDefaultEndOfDay ? to : defaultTimeState.to,
          }));

          setTimeType((state) => ({
            ...state,
            to: rangeDefaultEndOfDay ? TIMES_OF_DAY.PM : TIMES_OF_DAY.AM,
          }));

          return handleDateChange({
            endDate: null,
            focusedInput: START_DATE,
          });
        }

        const normalizedDate = date || parse(value, dateFormat, new Date());
        const zonedDate = timezone
          ? toZonedTime(normalizedDate, timezone)
          : normalizedDate;

        const time = {
          hours: zonedDate
            ? format(zonedDate, use24HourFormat ? "HH" : "KK")
            : null,
          minutes: zonedDate ? format(zonedDate, "mm") : null,
          seconds: zonedDate ? format(zonedDate, "ss") : null,
        };

        const timeType = zonedDate
          ? (format(zonedDate, "a") as TIMES_OF_DAY)
          : TIMES_OF_DAY.AM;

        setTime({ from: time, to: time });
        setTimeType({ from: timeType, to: timeType });
        handleDateChange({
          startDate: zonedDate,
          endDate: zonedDate,
          focusedInput: null,
        });
      };
    },
    [state, handleDateChange, rangeDefaultEndOfDay, timezone, use24HourFormat],
  );

  const onCancelDate = useCallback(() => {
    setState(defaultDateState);
    setTime(rangeDefaultEndOfDay ? rangeEndOfDayDefaultTime : defaultTimeState);
    setTimeType(
      rangeDefaultEndOfDay
        ? rangeEndOfDayDefaultTimeType
        : defaultTimeTypeState,
    );
    setTimezone(timezoneFallbackAfterCancelDate);
    onChangeTimezone?.(timezoneFallbackAfterCancelDate);
    setTimeHandlerOn({
      from: false,
      to: false,
    });
    onClose?.();
    onChange("");
  }, [
    onClose,
    onChange,
    rangeDefaultEndOfDay,
    timezoneFallbackAfterCancelDate,
  ]);

  useUpdateEffect(() => {
    if (hideControlButtons && !disableCloseOnChange) {
      onApplyDate();
      setTimeHandlerOn({
        from: false,
        to: false,
      });
      onClose?.();
    }

    if (disableDatepickerTooltip && hideControlButtons) {
      applyDate();
    }
  }, [state]);

  return {
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
    timeType,
    time,
    onCancelDate,
    onApplyDate,
    handleClose,
    isTimeVisible,
    timeHandlerOn,
    timeVisibilityHandler,
    disableTimeHandler,
  };
};
