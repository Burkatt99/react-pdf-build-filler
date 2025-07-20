import { PDFDocument, PDFImage } from "pdf-lib";

// Function to extract base64 data from Data URL
export const extractBase64Data = async (
  pdfDoc: PDFDocument,
  value: string,
): Promise<PDFImage> => {
  const extractBase64Data = (dataUrl: string) => {
    const base64Index = dataUrl?.indexOf("base64,") + "base64,".length;

    return dataUrl?.substring(base64Index);
  };

  const base64Signature = extractBase64Data(value);
  const imageBytes = Uint8Array.from(atob(base64Signature), (c) =>
    c.charCodeAt(0),
  );

  const image = await pdfDoc.embedPng(imageBytes);

  return image;
};
