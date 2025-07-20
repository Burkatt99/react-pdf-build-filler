import React from "react";
import { useController, useFormContext } from "react-hook-form";

import Input from "@/components/Controls/Input";
import { appReactMemo } from "@/hocs/appReactMemo";

import { IInputProps } from "../Controls/Input/types";

export interface IFormInput extends IInputProps {
  name: string;
  customComponent?: React.ElementType;
}

const FormInput = ({
  name,
  customComponent: CustomComponent,
  ...rest
}: IFormInput) => {
  const { control } = useFormContext();
  const {
    field: { ref: _, value, ...field },
    fieldState: { error },
  } = useController({ control, name });

  const InputComponent = CustomComponent || Input;

  return (
    <InputComponent
      {...field}
      {...rest}
      value={value || ""}
      error={!!error}
      errorMessage={error?.message}
    />
  );
};

export default appReactMemo(FormInput);
