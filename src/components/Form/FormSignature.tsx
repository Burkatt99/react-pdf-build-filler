import React from "react";
import { useController, useFormContext } from "react-hook-form";

import Signature from "@/components/Controls/Signature";
import { appReactMemo } from "@/hocs/appReactMemo";

import { ISignatureProps } from "../Controls/Signature/types";

export interface IFormSignature extends ISignatureProps {
  name: string;
  label?: string;
  disabled?: boolean;
  customComponent?: React.ElementType;
  onEndDrawing?: () => void;
}

const FormSignature = (props: IFormSignature) => {
  const {
    name,
    disabled,
    label,
    onEndDrawing,
    customComponent: CustomComponent,
    ...rest
  } = props;
  const { control, trigger, setValue } = useFormContext();

  const {
    field: { ref: _, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const handleSignature = React.useCallback((signature: string) => {
    setValue(name, signature, { shouldDirty: true });
    trigger(name);
    onEndDrawing?.();
  }, []);

  const handleDeleteSignature = React.useCallback(() => {
    setValue(name, null, { shouldDirty: true });
    trigger(name);
    onEndDrawing?.();
  }, []);

  const SignatureComponent = CustomComponent || Signature;

  return (
    <SignatureComponent
      {...rest}
      value={value}
      label={label}
      disabled={disabled}
      errorMessage={error?.message}
      handleSignature={handleSignature}
      handleDeleteSignature={handleDeleteSignature}
    />
  );
};

export default appReactMemo(FormSignature);
