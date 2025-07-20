import { ComponentClasses } from "@/constants/types";

import { pdfReaderClasses } from "./constants";

export type FileForm = Record<string, string | boolean>;
export type PdfFormClasses = Partial<typeof pdfReaderClasses>;
export type PdfReaderClasses = PdfFormClasses & {
  components?: ComponentClasses;
};
