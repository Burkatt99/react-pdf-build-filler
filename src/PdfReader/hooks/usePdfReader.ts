import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { ICustomFieldByRole } from "@/constants/types";
import { fileToBase64 } from "@/utils/fileToBase64";

import { IFileForm, IPdfReaderResult } from "../../constants/types";
import { updatePdfForm } from "../utils";

type IPDFEditorProps = {
  pdfFile: File;
  formData?: Record<string, ICustomFieldByRole[]>;
  onConfirm: (result: IPdfReaderResult) => void;
};

type UsePDFEditor = {
  ref: React.RefObject<HTMLDivElement | null>;
  contentHeight: number | null;
  fileUrl: string | Uint8Array;
  fetchAndFillPdf: (values: IFileForm, withSaving?: boolean) => void;
};

const usePDFEditor = ({
  pdfFile,
  formData,
  onConfirm,
}: IPDFEditorProps): UsePDFEditor => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [fileUrl, setfileUrl] = useState<string>("");

  useLayoutEffect(() => {
    const fetchFileUrl = async () => {
      if (pdfFile) {
        const url = await fileToBase64(pdfFile);

        setfileUrl(url);
      }
    };

    fetchFileUrl();
  }, []);

  const fetchAndFillPdf = useCallback(
    async (values: IFileForm, withSaving?: boolean) => {
      const blob = await updatePdfForm({
        values,
        fileUrl,
        formData,
      });
      const file = new File([blob], "file.pdf", { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      setfileUrl(url);

      if (withSaving) {
        onConfirm({ file, formData: values });
      }
    },
    [fileUrl, formData, setfileUrl, onConfirm],
  );

  useEffect(() => {
    if (ref.current) {
      setContentHeight(ref.current.clientHeight);
    }
  }, [ref.current]);

  return {
    ref,
    contentHeight,
    fileUrl,
    fetchAndFillPdf,
  };
};

export default usePDFEditor;
