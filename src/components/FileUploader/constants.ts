export const MAX_ATTACHMENT_SIZE = 3145728;

export const ERROR_CODES: Record<string, string> = {
  "file-too-large": "validations.file.tooLarge",
  "file-invalid-type": "validations.file.invalidType",
};

export const fileUploaderClasses = {
  container: "FileUploader__container",
  dndBlock: "FileUploader__dnd-block",
  dndConatainer: "FileUploader__dnd-container",
  uploadBlock: "FileUploader__upload-block",
  uploadInfo: "FileUploader__upload-info",
  uploadTitle: "FileUploader__upload-title",
  uploadSize: "FileUploader__upload-size",
  accentText: "FileUploader__accent-text",
  uploadIcon: "FileUploader__upload-icon",
  errorBlock: "FileUploader__error-block",
};
