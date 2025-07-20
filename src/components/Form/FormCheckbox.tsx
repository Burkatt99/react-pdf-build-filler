import React from "react";
import { useController, useFormContext } from "react-hook-form";

import Checkbox from "@/components/Controls/Checkbox";
import { appReactMemo } from "@/hocs/appReactMemo";

import { ICheckboxProps } from "../Controls/Checkbox/types";

export interface IFormCheckbox extends ICheckboxProps {
  name: string;
  customComponent?: React.ElementType;
}

const FormCheckbox = ({
  name = "",
  customComponent: CustomComponent,
  ...rest
}: IFormCheckbox) => {
  const { control } = useFormContext();
  const {
    field: { ref: _, value, ...field },
  } = useController({ control, name });
  const Component = CustomComponent || Checkbox;

  return (
    <>
      <Component checked={!!value} {...field} {...rest} value={value} />
    </>
  );
};

export default appReactMemo(FormCheckbox);
