import cn from "classnames";

import "./styles.scss";

import { TCustomComponents } from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";

import {
  ICustomFieldByRole,
  IDefaultValuesDynamicForm,
  IPdfReaderResult,
} from "../constants/types";

import PdfForm from "./components/PdfForm";
import PDFViewer from "./components/PDFViewer";
import usePdfReader from "./hooks/usePdfReader";

import { pdfReaderClasses } from "./constants";
import { PdfReaderClasses } from "./types";

interface IPDFEditorProps {
  pdfFile: File;
  isDisabled?: boolean;
  classes?: PdfReaderClasses;
  customComponents?: TCustomComponents;
  initialValues?: IDefaultValuesDynamicForm;
  formData?: Record<string, ICustomFieldByRole[]>;
  onConfirm: (result: IPdfReaderResult) => void;
}

const PDFEditor = (props: IPDFEditorProps) => {
  const {
    pdfFile,
    isDisabled = false,
    formData,
    classes,
    initialValues,
    customComponents,
    onConfirm,
  } = props;

  const { ref, contentHeight, fileUrl, fetchAndFillPdf } = usePdfReader({
    pdfFile,
    formData,
    onConfirm,
  });

  return (
    <div
      className={cn(pdfReaderClasses.container, classes?.container)}
      ref={ref}
    >
      {!!fileUrl && (
        <div
          className={cn(pdfReaderClasses.content, classes?.content)}
          style={{ maxHeight: contentHeight || 0, height: contentHeight || 0 }}
        >
          <PdfForm
            formData={formData}
            classes={classes}
            isDisabled={isDisabled}
            initialValues={initialValues}
            customComponents={customComponents}
            fetchAndUpdatePdf={isDisabled ? () => null : fetchAndFillPdf}
          />

          <PDFViewer fileUrl={fileUrl} className={classes?.pdfViewer} />
        </div>
      )}
    </div>
  );
};

export default appReactMemo(PDFEditor);
