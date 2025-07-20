import React from "react";
import { FormProvider } from "react-hook-form";
import cn from "classnames";

import "./styles.scss";

import FormCheckbox from "@/components/Form/FormCheckbox";
import FormSelect from "@/components/Form/FormSelect";
import {
  ICustomFieldByRole,
  IDefaultValuesDynamicForm,
  TCustomComponents,
} from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";
import { FileForm, PdfReaderClasses } from "@/PdfReader/types";

import Button from "../../../components/Button";
import FormCountrySelect from "../../../components/Form/FormCountrySelect";
import FormDatePicker from "../../../components/Form/FormDatePicker";
import FormInput from "../../../components/Form/FormInput";
import FormSignature from "../../../components/Form/FormSignature";
import FormUploadPhoto from "../../../components/Form/FormUploadPhoto";
import { pdfReaderClasses } from "../../constants";
import usePdfForm from "../../hooks/usePdfForm";

interface IPdfFormProps {
  isDisabled?: boolean;
  loading?: boolean;
  formData?: Record<string, ICustomFieldByRole[]>;
  classes?: PdfReaderClasses;
  customComponents?: TCustomComponents;
  initialValues?: IDefaultValuesDynamicForm;
  fetchAndUpdatePdf: (values: FileForm, withSaving?: boolean) => void;
}

const PdfForm = (props: IPdfFormProps) => {
  const {
    formData = {},
    isDisabled,
    loading,
    classes,
    customComponents,
    initialValues,
    fetchAndUpdatePdf,
  } = props;
  const { components: componentClasses } = classes || {};

  const {
    allFields,
    disabledSave,
    isSubmitting,
    methods,
    scrollableRef,
    scrollPosition,
    handleSubmitForm,
    handleCheckbox,
    handleSelect,
  } = usePdfForm({
    formData,
    isDisabled,
    initialValues,
    fetchAndUpdatePdf,
  });
  const { watch, handleSubmit } = methods;

  const renderFields = React.useMemo(
    () =>
      allFields?.map((field, index) => {
        const { type, name: fieldName, label, options = [], position } = field;
        const { height, width } = position || {};

        switch (type) {
          case "STRING":
          case "NUMBER":
            return (
              <FormInput
                key={index}
                name={fieldName}
                label={label || ""}
                disabled={isDisabled}
                onBlurCapture={() => fetchAndUpdatePdf(watch())}
                placeholder="Enter your value..."
                classes={componentClasses?.input}
                customComponent={customComponents?.input}
              />
            );
          case "DATE":
          case "PARTLY_DATE":
            return (
              <FormDatePicker
                key={index}
                name={fieldName}
                label={label || ""}
                disabled={isDisabled}
                scrollPosition={scrollPosition}
                additionFunc={() => fetchAndUpdatePdf(watch())}
                classes={componentClasses?.datepicker}
                customComponent={customComponents?.datepicker}
              />
            );
          case "COUNTRY":
            return (
              <FormCountrySelect
                key={index}
                disableUnselect
                name={fieldName}
                label={label || ""}
                placeholder="Select country"
                onChange={(value) => handleSelect(fieldName, value)}
                classes={componentClasses?.select}
                customComponent={customComponents?.select}
              />
            );
          case "SELECT":
          case "DROPDOWN":
            return (
              <FormSelect
                key={index}
                name={fieldName}
                label={label || ""}
                placeholder="Select an option"
                disabled={isDisabled}
                onChange={(value) => handleSelect(fieldName, value)}
                options={options.map(({ value, label }) => ({
                  value: value,
                  label: label,
                }))}
                classes={componentClasses?.select}
                customComponent={customComponents?.select}
              />
            );
          case "CHECKBOX":
            return (
              <FormCheckbox
                key={index}
                name={fieldName}
                label={label || ""}
                disabled={isDisabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCheckbox(e)
                }
                classes={componentClasses?.checkbox}
                customComponent={customComponents?.checkbox}
              />
            );
          case "SIGNATURE":
            return (
              <FormSignature
                key={index}
                label={label || ""}
                name={fieldName}
                disabled={isDisabled}
                onEndDrawing={() => fetchAndUpdatePdf(watch())}
                classes={componentClasses?.signature}
                customComponent={customComponents?.signature}
              />
            );
          case "IMAGE":
            return (
              <FormUploadPhoto
                key={index}
                name={fieldName}
                height={height}
                width={width}
                label={label || ""}
                disabled={isDisabled}
                onUploadPhoto={() => fetchAndUpdatePdf(watch())}
                classes={componentClasses?.uploadPhoto}
                customComponent={customComponents?.uploadPhoto}
              />
            );
        }
      }),
    [allFields, scrollPosition],
  );

  return (
    <FormProvider {...methods}>
      <div
        onSubmit={handleSubmit(handleSubmitForm)}
        className={cn(pdfReaderClasses.form, classes?.form)}
        ref={scrollableRef}
      >
        <div className={cn(pdfReaderClasses.formContent, classes?.formContent)}>
          {renderFields}
        </div>

        <div className={cn(pdfReaderClasses.formFooter, classes?.formFooter)}>
          <div
            className={cn(
              pdfReaderClasses.footerContent,
              classes?.footerContent,
            )}
          >
            {!isDisabled && (
              <Button
                type="submit"
                variant="primary"
                width="100%"
                disabled={isSubmitting || disabledSave || loading}
                loading={isSubmitting || loading}
                onClick={handleSubmit(handleSubmitForm)}
                className={cn(
                  pdfReaderClasses.submitButton,
                  classes?.submitButton,
                )}
              >
                {"Update document"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default appReactMemo(PdfForm);
