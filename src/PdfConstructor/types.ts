import { ITabsNamings } from "@/components/Tabs/types";
import {
  ComponentClasses,
  IDataConstructor,
  IResult,
  TCustomComponents,
} from "@/constants/types";

import {
  baseTabClasses,
  customFieldClasses,
  previewFieldClasses,
  settingsClasses,
} from "./constants";

export type PreviewFieldClasses = Partial<typeof previewFieldClasses>;

export type BaseTabClasses = Partial<typeof baseTabClasses>;

export type SettingsClasses = Partial<typeof settingsClasses> & {
  tabs?: ITabsNamings;
  preview?: PreviewFieldClasses;
  components?: ComponentClasses;
  baseTab?: BaseTabClasses;
};

export type CustomFieldClasses = Partial<typeof customFieldClasses>;

export type FormBuilderClasses = Partial<{
  header: string;
  title: string;
  button: string;
}>;

export type PdfViewerZoneClasses = Partial<{
  prevPage: string;
  nextPage: string;
  pageButton: string;
}>;

export interface IPdfConstructorClasses {
  settings?: SettingsClasses;
  customField?: CustomFieldClasses;
  formBuilder?: FormBuilderClasses;
  pdfViewerZone?: PdfViewerZoneClasses;
}

export interface IPdfConstructorProps {
  data: IDataConstructor;
  classes?: IPdfConstructorClasses;
  customComponents?: TCustomComponents;
  onSave: (result: IResult) => void;
  onUpdateField?: () => void;
}
