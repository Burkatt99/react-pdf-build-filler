import React from "react";
import { useController, useFormContext } from "react-hook-form";

import Select from "@/components/Controls/Select";
import { appReactMemo } from "@/hocs/appReactMemo";

import { ISelectProps } from "../Controls/Select/types";

export interface IFormSelect extends ISelectProps {
  name: string;
  customComponent?: React.ElementType;
}

const FormSelect = (props: IFormSelect) => {
  const { name = "", customComponent: CustomComponent, ...rest } = props;
  const { control } = useFormContext();
  const {
    field: { ref: _, ...field },
    fieldState: { error },
  } = useController({ control, name });

  const options = React.useMemo(() => {
    return rest.options;
  }, [field.value, rest.options]);

  const SelectComponent = CustomComponent || Select;

  return (
    <SelectComponent
      {...field}
      {...rest}
      options={options}
      error={!!error?.message}
      errorMessage={error?.message}
    />
  );
};

export default appReactMemo(FormSelect);
