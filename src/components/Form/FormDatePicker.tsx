import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { format } from "date-fns";

import { DATE_MASK } from "@/constants/common";
import { appReactMemo } from "@/hocs/appReactMemo";

import DatePickerInput, { IDatePickerInput } from "../Controls/DatePickerInput";

export interface IFormDatePicker extends Partial<IDatePickerInput> {
  name: string;
  customComponent?: React.ElementType;
  additionFunc?: () => void;
}

const FormDatePicker = (props: IFormDatePicker) => {
  const {
    name,
    placeholder,
    valueMask = DATE_MASK,
    settingsConfig,
    customComponent: CustomComponent,
    additionFunc,
    ...rest
  } = props;

  const { control } = useFormContext();
  const {
    field: { ref: _, value, ...field },
    fieldState: { error },
  } = useController({ control, name });

  const onSelectDate = React.useCallback(
    (from: string) => {
      field.onChange(from ? format(new Date(from), valueMask) : null);
      additionFunc?.();
      return;
    },
    [field, valueMask],
  );

  const DateComponent = CustomComponent || DatePickerInput;

  return (
    <DateComponent
      {...rest}
      placeholder={placeholder || "Select date"}
      settingsConfig={settingsConfig}
      valueMask={valueMask}
      value={value}
      onChange={onSelectDate}
      error={!!error}
      errorMessage={error?.message}
    />
  );
};

export default appReactMemo(FormDatePicker);
