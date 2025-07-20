import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FieldError, useForm, UseFormReturn } from "react-hook-form";

import { advanceList, groupedFields } from "@/constants/settings";
import { IBuilderField, ISortOption } from "@/constants/types";
import { usePdfConstructor } from "@/context";

import { getResolver, IBaseForm } from "../helpers";

type UseSettingsProps = {
  onUpdateField?: () => void;
};

type UseSettingsType = {
  selected: IBuilderField | null;
  selectedTab: string;
  filteredTabs: string[];
  methods: UseFormReturn<IBaseForm>;
  isSubmitting: boolean;
  disabledSave: boolean;
  defaultValues: Record<string, unknown>;
  sortOptionsError?: FieldError;
  isDropdownField: boolean;
  setSelectedTab: (newValue: string) => void;
  onTabChange: (_e: React.SyntheticEvent, newValue: string | number) => void;
  handleSubmitForm: (values: IBaseForm) => Promise<void>;
  handleSetOptions: (sortOptions: ISortOption[]) => void;
};

const useSettings = ({ onUpdateField }: UseSettingsProps): UseSettingsType => {
  const {
    allFields,
    selectedField: selected,
    updateField,
    updatePartlyFields,
  } = usePdfConstructor();
  const [selectedTab, setSelectedTab] = useState<string>("");
  const { validation, name, label, option, sortOptions } = selected || {};

  const resolver = getResolver(selected?.type || "");
  const methods = useForm({ resolver });
  const { reset, formState, setError, getFieldState, setValue } = methods;
  const { isValid, isDirty, isSubmitting } = formState;
  const disabledSave = !isDirty && isValid;
  const sortOptionsError = getFieldState("sortOptions")?.error;
  const isDropdownField = selected?.type === "dropdown";

  const defaultValues = useMemo(
    () => ({
      isRequired: !!validation?.isRequired,
      fieldName: name,
      label: label as string,
      optionValue: option?.value as string,
      optionLabel: option?.label,
      condition: validation?.condition,
      isCellFormat: !!validation?.isCellFormat,
      minLength: validation?.minLength,
      maxLength: validation?.maxLength,
      sortOptions: sortOptions,
    }),
    [validation, name, label, option, sortOptions],
  );

  const filteredTabs = useMemo(
    () => [
      "base",
      ...(advanceList.includes(selected?.type as string) ? ["advance"] : []),
    ],
    [selected?.type],
  );

  useEffect(() => {
    reset(defaultValues || {});
  }, [reset, defaultValues]);

  const onTabChange = useCallback(
    (_e: React.SyntheticEvent, newValue: string | number) => {
      setSelectedTab(newValue as string);
    },
    [],
  );

  const updateFieldData = useCallback(
    (settings: Partial<IBuilderField>) => {
      if (!selected) return;

      if (groupedFields.includes(selected.type as string)) {
        updatePartlyFields(selected.uuid, selected.name, settings);
      } else {
        updateField(selected.uuid, settings);
      }
    },
    [selected, updateField, updatePartlyFields],
  );

  const handleSubmitForm = useCallback(
    async (values: IBaseForm) => {
      const {
        optionLabel,
        optionValue,
        fieldName,
        sortOptions,
        label,
        ...rest
      } = values;

      const existField = allFields.some((field) => field.name === fieldName);
      const isExist = selected?.name !== fieldName && existField;

      if (isExist && !groupedFields.includes(selected?.type as string)) {
        setError("fieldName", {
          type: "manual",
          message: "Field with this name already exists.",
        });
      } else {
        try {
          await updateFieldData({
            name: fieldName,
            label: label,
            option: {
              label: optionLabel as string,
              value: optionValue as string,
            },
            formState: {
              isValid: isValid,
              showError: false,
            },
            sortOptions: sortOptions,
            validation: {
              ...rest,
            },
          });

          reset(values);

          onUpdateField?.();
        } catch (_) {
          // do nothing
        }
      }
    },
    [updateFieldData, isValid, allFields, selected],
  );

  useEffect(() => {
    setSelectedTab(filteredTabs[0]);
  }, [filteredTabs]);

  const handleSetOptions = React.useCallback((sortOptions: ISortOption[]) => {
    setValue("sortOptions", sortOptions, { shouldDirty: true });
  }, []);

  return {
    selected,
    selectedTab,
    filteredTabs,
    setSelectedTab,
    methods,
    isSubmitting,
    disabledSave,
    defaultValues,
    sortOptionsError,
    isDropdownField,
    onTabChange,
    handleSubmitForm,
    handleSetOptions,
  };
};

export default useSettings;
