import { Area } from "react-easy-crop";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

interface IGetCroppedImgProps {
  imgSrc: string;
  croppedAreaPixels: Area;
  width?: number;
  height?: number;
  fileName?: string;
}

export const getOptimalCanvasSize = async (
  imgSrc: string,
  scaleFactor = 0.5,
) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.src = imgSrc;
    image.onload = () => {
      const targetWidth = Math.round(image.width * scaleFactor);
      const targetHeight = Math.round(image.height * scaleFactor);
      resolve({ width: targetWidth, height: targetHeight });
    };
    image.onerror = reject;
  });
};

export const getCroppedImg = async ({
  imgSrc,
  croppedAreaPixels,
  fileName = "cropped-image.png",
}: IGetCroppedImgProps): Promise<File | null> => {
  const image = await createImage(imgSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const { width, height } = await getOptimalCanvasSize(imgSrc, 0.5);

  if (!ctx) {
    return null;
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    width,
    height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: "image/png" });
          resolve(file);
        } else {
          reject(new Error("Failed to create file"));
        }
      },
      "image/png",
      1.0,
    );
  });
};
