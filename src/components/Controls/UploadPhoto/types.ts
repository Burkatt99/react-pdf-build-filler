import { uploadPhotoClasses } from "./constants";

export type UploadPhotoClasses = Partial<typeof uploadPhotoClasses>;

export interface IUploadPhotoProps {
  value?: string;
  disabled?: boolean;
  label?: string;
  errorMessage?: string;
  width?: number;
  height?: number;
  classes?: UploadPhotoClasses;
  handlePhoto?: (formatedPhoto: string) => void;
  handleDeletePhoto?: () => void;
}
