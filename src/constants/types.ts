import { CheckboxClasses } from "@/components/Controls/Checkbox/types";
import { TDatePickerClasses } from "@/components/Controls/Datepicker/types";
import { InputClasses } from "@/components/Controls/Input/types";
import { SelectClasses } from "@/components/Controls/Select/types";
import { SignatureFieldClassess } from "@/components/Controls/Signature/types";
import { UploadPhotoClasses } from "@/components/Controls/UploadPhoto/types";

export type TButtonTypes =
  | "primary"
  | "danger"
  | "outline"
  | "icon"
  | "iconSolid"
  | "secondary"
  | "transparent"
  | "link"
  | undefined;
export type TButtonSizes = "xs" | "sm" | "md" | "lg";

export interface IOption {
  value: string | number | boolean;
  label: string;
}

export type TFieldTypes =
  | "text"
  | "number"
  | "date"
  | "partlyDate"
  | "country"
  | "checkbox"
  | "signature"
  | "image"
  | "radio"
  | "dropdown";

export interface IValidationField {
  isRequired: boolean;
  isCellFormat?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
  condition?: string;
}

export interface IPositionField {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

export interface ISortOption {
  value: string;
  label: string;
}

export interface IField {
  type: TFieldTypes;
  name: string;
  label: string | null;
  role: string;
  placeholder?: string;
  option: IOption | null;
  sortOptions?: ISortOption[];
}

export interface IBuilderField extends IField {
  uuid: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  role: string;
  formState: {
    isValid: boolean;
    showError?: boolean;
  };
  validation: IValidationField;
}

export interface ICustomFieldByRole {
  name: string;
  label: string | null;
  options?: IOption[];
  type: string;
  sortingId: number;
  validation: IValidationField;
  position?: IPositionField;
}

export interface IResult {
  formData: Record<string, ICustomFieldByRole[]>;
  templateData: IBuilderField[];
  file: File;
}

export interface ICustomField {
  name: string;
  type: string;
  uuid?: string;
  width: number;
  height: number;
  placeholder?: string;
  customPreview?: boolean;
}

export interface IFieldFormData {
  label: string;
  name: string;
  isRequired: boolean;
  role: string;
  option?: IOption;
}

export interface IResizedField {
  uuid: string;
  width: number;
  height: number;
  newX: number;
  newY: number;
}

export interface IDropItem {
  type: TFieldTypes;
  width: number;
  height: number;
  placeholder: string;
  field: IBuilderField | null;
}

export interface IDataConstructor {
  pdfFile: File;
  templateName?: string;
  fields?: IBuilderField[];
}

export interface IFileForm {
  [key: string]: string | boolean | number | undefined | null;
}

export interface IPdfReaderResult {
  file: File;
  formData: IFileForm;
}

export type ITooltipNamings = Partial<{
  container: string;
  wrapper: string;
  message: string;
}>;

export enum KEY_NAMES {
  ARROW_UP = "ArrowUp",
  ARROW_DOWN = "ArrowDown",
  ESCAPE = "Escape",
  ENTER = "Enter",
  SPACE_BAR = "SpaceBar",
}

export const SCROLL_KEYS = Object.keys(KEY_NAMES);

export interface IDefaultValuesDynamicForm {
  [key: string]: string | boolean | number | undefined | null;
}

export type TCustomComponents = Partial<{
  checkbox: React.ElementType;
  input: React.ElementType;
  select: React.ElementType;
  datepicker: React.ElementType;
  signature: React.ElementType;
  uploadPhoto: React.ElementType;
}>;

export type ComponentClasses = Partial<{
  checkbox: CheckboxClasses;
  input: InputClasses;
  select: SelectClasses;
  datepicker: TDatePickerClasses;
  signature: SignatureFieldClassess;
  uploadPhoto: UploadPhotoClasses;
}>;
