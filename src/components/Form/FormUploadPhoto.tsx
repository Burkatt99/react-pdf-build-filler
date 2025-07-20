import React from "react";
import { useController, useFormContext } from "react-hook-form";

import UploadPhoto from "@/components/Controls/UploadPhoto";

import { IUploadPhotoProps } from "../Controls/UploadPhoto/types";

export interface IFormUploadPhoto extends IUploadPhotoProps {
  name: string;
  label?: string;
  disabled?: boolean;
  customComponent?: React.ElementType;
  onUploadPhoto?: () => void;
}

const FormUploadPhoto = (props: IFormUploadPhoto) => {
  const {
    name,
    disabled,
    label,
    onUploadPhoto,
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

  const handlePhoto = React.useCallback(async (formatedPhoto: string) => {
    setValue(name, formatedPhoto, { shouldDirty: true });
    trigger(name);
    onUploadPhoto?.();
  }, []);

  const handleDeletePhoto = React.useCallback(() => {
    setValue(name, null, { shouldDirty: true });
    trigger(name);
    onUploadPhoto?.();
  }, []);

  const UploadPhotoComponent = CustomComponent || UploadPhoto;

  return (
    <UploadPhotoComponent
      {...rest}
      value={value}
      label={label}
      errorMessage={error?.message}
      disabled={disabled}
      handlePhoto={handlePhoto}
      handleDeletePhoto={handleDeletePhoto}
    />
  );
};

export default FormUploadPhoto;
