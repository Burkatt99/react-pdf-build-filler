export const convertArrayToFile = (
  binaryData: Uint8Array,
  mimeType: string,
) => {
  const blob = new Blob([binaryData], { type: mimeType });
  return URL.createObjectURL(blob);
};

export const fileToBinaryString = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as binary string."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};
