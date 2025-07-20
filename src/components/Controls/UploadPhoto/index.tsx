import React, { useCallback, useEffect, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import cn from "classnames";

import "./styles.scss";

import Button from "@/components/Button";
import FileUploader from "@/components/FileUploader";
import { ICONS_MAP } from "@/icons";
import { getCroppedImg } from "@/utils/canvas";
import { fileToBase64 } from "@/utils/fileToBase64";

import { containerStyle, mediaStyle, uploadPhotoClasses } from "./constants";
import { IUploadPhotoProps } from "./types";

const UploadPhoto = (props: IUploadPhotoProps) => {
  const {
    value = "",
    disabled,
    label,
    classes,
    width = 200,
    height = 260,
    errorMessage,
    handlePhoto = async () => {},
    handleDeletePhoto = () => {},
  } = props;
  const [imgSrc, setImgSrc] = useState<string>(value);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<string>();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onCropChange = useCallback((crop: Point) => setCrop(crop), []);

  const onZoomChange = useCallback((zoom: number) => setZoom(zoom), []);

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleUpload = useCallback(async ([file]: File[]) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImgSrc(url);
    } else {
      setImgSrc("");
    }
  }, []);

  const handleCrop = useCallback(async () => {
    const croppedImage = await getCroppedImg({
      imgSrc,
      croppedAreaPixels,
    });
    const formatedPhoto = await fileToBase64(croppedImage as File);

    if (croppedImage) {
      setImage(formatedPhoto);
      handlePhoto(formatedPhoto);
    }
  }, [imgSrc, croppedAreaPixels]);

  const onDeletePhoto = useCallback(() => {
    setImgSrc("");
    setImage("");
    handleDeletePhoto();
  }, []);

  useEffect(() => {
    if (value) {
      setImage(value);
    }
  }, [value]);

  return (
    <div className={cn(uploadPhotoClasses.container, classes?.container)}>
      <div className={cn(uploadPhotoClasses.label, classes?.label)}>
        {label}
      </div>

      {imgSrc ? (
        !image ? (
          <div className={cn(uploadPhotoClasses.editPhoto, classes?.editPhoto)}>
            <div
              className={cn(
                uploadPhotoClasses.cropperContainer,
                classes?.cropperContainer,
              )}
              style={{ height: `${height}px` }}
            >
              <Cropper
                image={imgSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                cropSize={{ width, height }}
                showGrid={false}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
                style={{ containerStyle, mediaStyle }}
              />
            </div>

            <div className={cn(uploadPhotoClasses.buttons, classes?.buttons)}>
              <Button variant="outline" onClick={onDeletePhoto} width="100%">
                Delete
              </Button>
              <Button variant="primary" onClick={handleCrop} width="100%">
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className={cn(uploadPhotoClasses.preview, classes?.preview)}>
            <img
              src={image}
              alt="preview"
              loading="lazy"
              height={height}
              width={width}
              className={cn(uploadPhotoClasses.previewImg, classes?.previewImg)}
            />
            <Button
              variant="icon"
              onClick={onDeletePhoto}
              startIcon={<ICONS_MAP.DeleteIcon />}
              className={cn(
                uploadPhotoClasses.deleteButton,
                classes?.deleteButton,
              )}
            />
          </div>
        )
      ) : (
        <FileUploader
          onUpload={handleUpload}
          fileType="image"
          disabled={disabled}
        />
      )}

      <div
        className={cn(uploadPhotoClasses.errorMessage, classes?.errorMessage)}
      >
        {errorMessage}
      </div>
    </div>
  );
};

export default UploadPhoto;
