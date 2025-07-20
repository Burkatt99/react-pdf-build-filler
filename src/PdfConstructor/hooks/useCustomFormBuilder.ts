import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { IBuilderField, IResizedField, IResult } from "@/constants/types";
import { usePdfConstructor } from "@/context";
import { createFormPdf } from "@/utils/createFormPdf";
import { fileToBase64 } from "@/utils/fileToBase64";
import { formattingFields } from "@/utils/formattingFields";

type UseCustomFormBuilderProps = {
  pdfFile: File;
  createdFields?: IBuilderField[];
  onSave: (result: IResult) => void;
};

type UseCustomFormBuilderType = {
  ref: React.RefObject<HTMLDivElement | null>;
  headerRef: React.RefObject<HTMLDivElement | null>;
  fields: IBuilderField[];
  contentHeight: number | null;
  isNewTemplate: boolean;
  fileUrl: string;
  onRemoveField: (uuid: string) => void;
  onResizeField: (field: IResizedField) => void;
  onSelect: (field: IBuilderField | null) => void;
  onAddField: (newField: IBuilderField) => void;
  onMoveField: (field: IBuilderField, newX: number, newY: number) => void;
  handleSaveChanges: () => void;
};

const useCustomFormBuilder = (
  props: UseCustomFormBuilderProps,
): UseCustomFormBuilderType => {
  const { pdfFile, createdFields, onSave } = props;
  const {
    allFields: fields,
    selectedField,
    fieldsWithErrors,
    addField,
    addFields,
    updateField,
    removeField,
    setSelectedField,
    setIsValidForm,
    setShowErrorForInvalidFields,
  } = usePdfConstructor();

  const ref = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const isNewTemplate = useMemo(() => !createdFields?.length, [createdFields]);
  const [fileUrl, setFileUrl] = useState<string>("");

  useEffect(() => {
    if (createdFields) {
      addFields(createdFields);
    }
  }, [createdFields]);

  useLayoutEffect(() => {
    const fetchFileUrl = async () => {
      if (pdfFile) {
        const url = await fileToBase64(pdfFile);

        setFileUrl(url);
      } else {
        setFileUrl("");
      }
    };

    fetchFileUrl();
  }, []);

  const onRemoveField = useCallback(
    (uuid: string) => {
      removeField(uuid);

      if (selectedField?.uuid === uuid) {
        setSelectedField(null);
      }
    },
    [removeField, selectedField],
  );

  const onResizeField = useCallback(
    ({ uuid, width, height, newX, newY }: IResizedField) => {
      updateField(uuid, { width, height, x: newX, y: newY });
    },
    [],
  );

  const onSelect = useCallback((field: IBuilderField | null) => {
    setSelectedField(field);
  }, []);

  const onAddField = useCallback(
    (newField: IBuilderField) => {
      addField(newField);
      onSelect(newField);
    },
    [addField, onSelect],
  );

  const onMoveField = useCallback(
    (field: IBuilderField, newX: number, newY: number) => {
      updateField(field.uuid, { x: newX, y: newY });
      onSelect(field);
    },
    [updateField, onSelect],
  );

  useEffect(() => {
    if (ref.current && headerRef.current) {
      const headerHeight = headerRef.current.clientHeight;
      const contentHeight = ref.current.clientHeight - headerHeight;

      setContentHeight(contentHeight);
    }
  }, [ref.current, headerRef.current]);

  const handleSaveChanges = useCallback(async () => {
    if (fieldsWithErrors.length) {
      return setShowErrorForInvalidFields();
    } else {
      const blob = await createFormPdf({
        fields,
        fileUrl,
        isUpdate: !isNewTemplate,
      });
      const file = new File([blob], "file.pdf", { type: "application/pdf" });

      onSave({
        formData: formattingFields(fields),
        templateData: fields,
        file,
      });
    }
  }, [fileUrl, fieldsWithErrors, fields, isNewTemplate]);

  useEffect(() => {
    if (!fieldsWithErrors.length) {
      setIsValidForm();
    }
  }, [fieldsWithErrors.length]);

  return {
    ref,
    headerRef,
    fields,
    fileUrl,
    contentHeight,
    isNewTemplate,
    onRemoveField,
    onResizeField,
    onSelect,
    onAddField,
    onMoveField,
    handleSaveChanges,
  };
};

export default useCustomFormBuilder;
