import React, { createContext, useContext, useMemo, useState } from "react";

import { IBuilderField } from "@/constants/types";

interface IPdfConstructorContext {
  selectedField: IBuilderField | null;
  templateName: string;
  pdfFile: string;
  allFields: IBuilderField[];
  fieldsWithErrors: IBuilderField[];
  isValid: boolean;
  setTemplateName: (name: string) => void;
  setPdfFile: (file: string) => void;
  addField: (field: IBuilderField) => void;
  addFields: (fields: IBuilderField[]) => void;
  updateField: (id: string, changes: Partial<IBuilderField>) => void;
  removeField: (id: string) => void;
  setSelectedField: (field: IBuilderField | null) => void;
  setIsValidForm: () => boolean;
  setShowErrorForInvalidFields: () => void;
  resetState: () => void;
  updatePartlyFields: (
    id: string,
    name: string,
    changes: Partial<IBuilderField>,
  ) => void;
}

type PdfConstructorProviderProps = {
  children: React.ReactNode;
};

const PdfConstructorContext = createContext<IPdfConstructorContext | null>(
  null,
);

export const PdfConstructorProvider = ({
  children,
}: PdfConstructorProviderProps) => {
  const [selectedField, setSelectedField] = useState<IBuilderField | null>(
    null,
  );
  const [templateName, setTemplateName] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<string>("");
  const [fields, setFields] = useState<Record<string, IBuilderField>>({});
  const [isValid, setIsValid] = useState<boolean>(true);

  const allFields = useMemo(() => Object.values(fields), [fields]);

  const fieldsWithErrors = useMemo(
    () =>
      Object.values(fields).filter(
        (field) => field.formState?.isValid === false,
      ),
    [fields],
  );

  const addField = (field: IBuilderField) => {
    setFields((prev) => ({ ...prev, [field.uuid]: field }));
  };

  const addFields = (newFields: IBuilderField[]) => {
    setFields((prev) => {
      const updatedFields = { ...prev };

      newFields.forEach((field) => {
        updatedFields[field.uuid] = field;
      });

      return updatedFields;
    });
  };

  const updateField = (id: string, changes: Partial<IBuilderField>) => {
    setFields((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...changes },
    }));

    setSelectedField((prev) => {
      if (prev && prev.uuid === id) {
        return { ...prev, ...changes };
      }

      return prev;
    });
  };

  const removeField = (id: string) => {
    setFields((prev) => {
      const newFields = { ...prev };
      delete newFields[id];
      return newFields;
    });
  };

  const updatePartlyFields = (
    id: string,
    name: string,
    changes: Partial<IBuilderField>,
  ) => {
    setFields((prev) => {
      const updatedFields = Object.entries(prev).reduce(
        (acc, [key, field]) => {
          if (field.name === name) {
            acc[key] = {
              ...field,
              label: changes.label || field.label,
              name: changes.name || field.name,
              role: field.role,
              validation: changes.validation || field.validation,
            };
          } else {
            acc[key] = field;
          }
          return acc;
        },
        {} as Record<string, IBuilderField>,
      );

      if (updatedFields[id]) {
        updatedFields[id] = { ...updatedFields[id], ...changes };
      }

      setSelectedField(updatedFields[id]);

      return updatedFields;
    });
  };

  const setShowErrorForInvalidFields = () => {
    setFields((prev) => {
      const updatedFields = { ...prev };
      let isFormValid = true;

      Object.values(updatedFields).forEach((field) => {
        if (!field.formState.isValid) {
          updatedFields[field.uuid] = {
            ...field,
            formState: { ...field.formState, showError: true },
          };
          isFormValid = false;
        }
      });

      setIsValid(isFormValid);
      return updatedFields;
    });
  };

  const setIsValidForm = (): boolean => {
    const hasInvalidFields = Object.values(fields).some(
      (field) => field.formState?.isValid === false,
    );

    setIsValid(!hasInvalidFields);

    return !hasInvalidFields;
  };

  const resetState = () => {
    setSelectedField(null);
    setTemplateName("");
    setPdfFile("");
    setFields({});
    setIsValid(true);
  };

  return (
    <PdfConstructorContext.Provider
      value={{
        selectedField,
        templateName,
        pdfFile,
        allFields,
        isValid,
        fieldsWithErrors,
        setTemplateName,
        setPdfFile,
        addField,
        addFields,
        updateField,
        removeField,
        setSelectedField,
        setIsValidForm,
        resetState,
        setShowErrorForInvalidFields,
        updatePartlyFields,
      }}
    >
      {children}
    </PdfConstructorContext.Provider>
  );
};

export const usePdfConstructor = () => {
  const context = useContext(PdfConstructorContext);

  if (!context) {
    throw new Error("usePdfConstructor should use in PdfConstructorProvider");
  }

  return context;
};
