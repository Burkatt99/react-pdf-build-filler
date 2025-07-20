import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { TSelectValue } from "@/components/Controls/Select/types";
import {
  ICustomFieldByRole,
  IDefaultValuesDynamicForm,
} from "@/constants/types";

import { createValidationSchema } from "../helpers";
import { FileForm } from "../types";

type IPdfFormProps = {
  isDisabled?: boolean;
  formData?: Record<string, ICustomFieldByRole[]>;
  initialValues?: IDefaultValuesDynamicForm;
  fetchAndUpdatePdf: (values: FileForm, withSaving?: boolean) => void;
};

type PdfForm = {
  allFields: ICustomFieldByRole[];
  disabledSave: boolean;
  isSubmitting: boolean;
  methods: ReturnType<typeof useForm>;
  scrollPosition: number;
  scrollableRef: React.RefObject<HTMLDivElement | null>;
  handleSubmitForm: (values: FileForm) => void;
  handleCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (name: string, value: TSelectValue) => void;
};

const usePdfForm = ({
  formData = {},
  isDisabled,
  initialValues,
  fetchAndUpdatePdf,
}: IPdfFormProps): PdfForm => {
  const roleFiller = "DEFAULT";
  const [allFields, setAllFields] = useState<ICustomFieldByRole[]>(
    formData[roleFiller] || [],
  );

  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const schema = createValidationSchema(formData[roleFiller] || []);
  const resolver = !isDisabled ? yupResolver(schema) : undefined;
  const methods = useForm({ resolver });
  const { formState, watch, reset, setValue } = methods;
  const { isValid, isSubmitting, isDirty } = formState;
  const disabledSave = !isDirty && isValid;

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableRef.current) {
        setScrollPosition(scrollableRef.current.scrollTop);
      }
    };

    const blockElement = scrollableRef.current;
    if (blockElement) {
      blockElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (blockElement) {
        blockElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const getDefaultValues = useCallback(
    async (fields: ICustomFieldByRole[]) => {
      const defaultValues = fields.reduce((acc, field) => {
        const { name, type } = field;
        const data = initialValues || {};

        if (name in data) {
          acc[name] = data[name];
        } else if (type === "DATE" || type === "PARTLY_DATE") {
          acc[name] = undefined;
        } else if (type === "CHECKBOX") {
          acc[name] = false;
        } else {
          acc[name] = "";
        }

        return acc;
      }, {} as IDefaultValuesDynamicForm);

      return defaultValues;
    },
    [initialValues],
  );

  React.useEffect(() => {
    const updateDefaultValues = async () => {
      let defaultValues = {};
      const fields = formData[roleFiller] || [];
      setAllFields(fields);

      defaultValues = await getDefaultValues(fields);

      reset(defaultValues);

      fetchAndUpdatePdf(watch());
    };

    if (roleFiller && formData) {
      updateDefaultValues();
    }
  }, [roleFiller, formData]);

  const handleSubmitForm = React.useCallback(
    (values: FileForm) => {
      fetchAndUpdatePdf(values, true);
    },
    [fetchAndUpdatePdf],
  );

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setValue(name as never, checked as never, { shouldDirty: true });
    fetchAndUpdatePdf(watch());
  };

  const handleSelect = (name: string, value: TSelectValue) => {
    setValue(name as never, value as never, { shouldDirty: true });
    fetchAndUpdatePdf(watch());
  };

  return {
    allFields,
    disabledSave,
    isSubmitting,
    methods,
    scrollableRef,
    scrollPosition,
    handleSubmitForm,
    handleCheckbox,
    handleSelect,
  };
};

export default usePdfForm;
