import React, { useCallback, useMemo, useState } from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";
import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";

import {
  ERROR_CODES,
  fileUploaderClasses,
  MAX_ATTACHMENT_SIZE,
} from "./constants";

type FileUploaderClasses = Partial<{
  container: string;
  dndBlock: string;
  dndConatainer: string;
  uploadBlock: string;
  uploadInfo: string;
  uploadTitle: string;
  uploadSize: string;
  accentText: string;
  uploadIcon: string;
  errorBlock: string;
}>;

interface IFileUploader {
  onUpload: (file: File[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
  maxFiles?: number;
  multiple?: boolean;
  fileType?: "pdf" | "image" | "all";
  height?: number;
  error?: string;
  showError?: boolean;
  classes?: FileUploaderClasses;
}

const FileUploader = (props: IFileUploader) => {
  const {
    onUpload,
    disabled,
    isLoading,
    maxFiles = 1,
    multiple = false,
    fileType = "all",
    error,
    showError = false,
    classes,
  } = props;

  const [loadError, setLoadError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const hasFiles = !!uploadedFiles.length;
  const size = (MAX_ATTACHMENT_SIZE / 1024 / 1024).toFixed(2);
  const errorMessages = loadError || error;

  const acceptType = useMemo(() => {
    switch (fileType) {
      case "pdf":
        return { "application/pdf": [] } as Accept;
      case "image":
        return { "image/*": [] } as Accept;
      case "all":
      default:
        return undefined;
    }
  }, [fileType]);

  const handleUpdateFiles = useCallback(
    (files: File[]) => {
      onUpload(files);
      setUploadedFiles(files);
    },
    [onUpload, setUploadedFiles],
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const errorCcode = fileRejections[0].errors[0].code;
    setLoadError(ERROR_CODES[errorCcode] || errorCcode);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        const filteredFiles = acceptedFiles.filter((acceptedFile) => {
          return !uploadedFiles.some(
            (uploadedFile) =>
              uploadedFile.name === acceptedFile.name &&
              uploadedFile.size === acceptedFile.size &&
              uploadedFile.type === acceptedFile.type &&
              uploadedFile.lastModified === acceptedFile.lastModified,
          );
        });
        handleUpdateFiles([...uploadedFiles, ...filteredFiles]);
        setLoadError("");
      }
    },
    [onUpload, uploadedFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropRejected,
    onDrop,
    maxSize: MAX_ATTACHMENT_SIZE,
    accept: acceptType,
    disabled: isLoading || disabled,
    maxFiles,
    multiple,
  });

  return (
    <div className={cn(fileUploaderClasses.container, classes?.container)}>
      {(!hasFiles || multiple) && (
        <div className={cn(fileUploaderClasses.dndBlock, classes?.dndBlock)}>
          <div
            {...getRootProps()}
            className={cn(
              fileUploaderClasses.dndConatainer,
              classes?.dndConatainer,
              {
                [`${fileUploaderClasses.dndConatainer}--drag-active ${classes?.dndConatainer}--drag-active`]:
                  isDragActive,
                [`${fileUploaderClasses.dndConatainer}--disabled ${classes?.dndConatainer}--disabled`]:
                  isLoading || disabled,
                [`${fileUploaderClasses.dndConatainer}--has-files ${classes?.dndConatainer}--has-files`]:
                  hasFiles,
              },
            )}
          >
            <input {...getInputProps()} />
            <div
              className={cn(
                fileUploaderClasses.uploadBlock,
                classes?.uploadBlock,
              )}
            >
              <div
                className={cn(
                  fileUploaderClasses.uploadIcon,
                  classes?.uploadIcon,
                )}
              >
                <ICONS_MAP.AddPhotoIcon />
              </div>

              <div
                className={cn(
                  fileUploaderClasses.uploadInfo,
                  classes?.uploadInfo,
                )}
              >
                <div
                  className={cn(
                    fileUploaderClasses.uploadTitle,
                    classes?.uploadTitle,
                  )}
                >
                  Drag and drop or
                  <div
                    className={cn(
                      fileUploaderClasses.accentText,
                      classes?.accentText,
                    )}
                  >
                    Browse
                  </div>
                </div>
                <span
                  className={cn(
                    fileUploaderClasses.uploadSize,
                    classes?.uploadSize,
                  )}
                >
                  JPG, PNG • {size}MB max
                </span>
              </div>
            </div>
          </div>
          {showError && (
            <div
              className={cn(
                fileUploaderClasses.errorBlock,
                classes?.errorBlock,
              )}
            >
              {errorMessages}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default appReactMemo(FileUploader);
