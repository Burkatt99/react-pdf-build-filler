import { FormProvider, useForm } from "react-hook-form";
import cn from "classnames";

import "./styles.scss";

import FormCheckbox from "@/components/Form/FormCheckbox";
import FormCountrySelect from "@/components/Form/FormCountrySelect";
import FormDatePicker from "@/components/Form/FormDatePicker";
import FormInput from "@/components/Form/FormInput";
import FormSelect from "@/components/Form/FormSelect";
import FormSignature from "@/components/Form/FormSignature";
import FormUploadPhoto from "@/components/Form/FormUploadPhoto";
import { ComponentClasses, TCustomComponents } from "@/constants/types";
import { usePdfConstructor } from "@/context";
import { appReactMemo } from "@/hocs/appReactMemo";
import { PreviewFieldClasses } from "@/PdfConstructor/types";

import { previewFieldClasses } from "../../../../constants";

type TPreviewFieldProps = {
  fieldName: string;
  label: string;
  type: string;
  width?: number;
  height?: number;
  classes?: PreviewFieldClasses;
  componentClasses?: ComponentClasses;
  customComponents?: TCustomComponents;
};

const PreviewField = (props: TPreviewFieldProps) => {
  const {
    fieldName,
    label,
    type,
    classes,
    width,
    height,
    componentClasses,
    customComponents,
  } = props;
  const { allFields: fields } = usePdfConstructor();
  const methods = useForm();

  const fieldValues = fields.filter((item) => item.name === fieldName);
  const dropdownField = fieldValues.find(
    (item) => item.type === "dropdown" && item.name === fieldName,
  );

  const renderPreviewField = () => {
    switch (type) {
      case "text":
      case "number":
        return (
          <FormInput
            type={type}
            name="textField"
            label={label}
            placeholder="Enter your value..."
            disabled
            classes={componentClasses?.input}
            customComponent={customComponents?.input}
          />
        );
      case "checkbox":
        return (
          <FormCheckbox
            name="checkboxField"
            label={label}
            classes={{
              container: `${previewFieldClasses.checkbox} ${componentClasses?.checkbox?.container}`,
              ...componentClasses?.checkbox,
            }}
            customComponent={customComponents?.checkbox}
          />
        );
      case "date":
      case "partlyDate":
        return (
          <FormDatePicker
            name="dateField"
            label={label}
            onChange={() => {}}
            classes={componentClasses?.datepicker}
            customComponent={customComponents?.datepicker}
          />
        );
      case "image":
        return (
          <FormUploadPhoto
            name="photoField"
            label={label}
            width={width}
            height={height}
            classes={componentClasses?.uploadPhoto}
            customComponent={customComponents?.uploadPhoto}
          />
        );
      case "signature":
        return (
          <FormSignature
            name="signatureField"
            label={label}
            classes={componentClasses?.signature}
            customComponent={customComponents?.signature}
          />
        );
      case "radio":
        return (
          <FormSelect
            label={label || ""}
            name="selectField"
            options={fieldValues.map((item) => ({
              value: item.option?.value,
              label: item.option?.label,
            }))}
            onChange={() => {}}
            classes={componentClasses?.select}
            customComponent={customComponents?.select}
          />
        );
      case "country":
        return (
          <FormCountrySelect
            name="countryField"
            label={label}
            classes={componentClasses?.select}
            customComponent={customComponents?.select}
          />
        );
      case "dropdown":
        return (
          <FormSelect
            label={label || ""}
            name={fieldName}
            options={(dropdownField?.sortOptions || []).map((option) => ({
              value: option.value || "",
              label: option.label || "",
            }))}
            onChange={() => {}}
            customComponent={customComponents?.select}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={cn(previewFieldClasses.previewBlock, classes?.previewBlock)}
      >
        {"Preview"}
        <div
          className={cn(
            previewFieldClasses.fieldWrapper,
            classes?.fieldWrapper,
          )}
        >
          {renderPreviewField()}
        </div>
      </form>
    </FormProvider>
  );
};

export default appReactMemo(PreviewField);
