import { PDFDocument } from "pdf-lib";

import "@pdf-lib/standard-fonts";

import { updateFiledsPdfForm } from "@/utils/updateFiledsPdfForm";

import { ICustomFieldByRole, IFileForm } from "../../constants/types";

interface ICreateFormPdfProps {
  values: IFileForm;
  fileUrl: string;
  formData?: Record<string, ICustomFieldByRole[]>;
}

export const formatImages = (
  values: IFileForm,
  formData: Record<string, ICustomFieldByRole[]>,
) => {
  const formDataFields = Object.values(formData).flat();

  const imageFields = formDataFields.filter((item) => item.type === "IMAGE");

  const updatedValues = { ...values };
  imageFields.forEach((field) => {
    if (field.name in updatedValues && updatedValues[field.name]) {
      updatedValues[field.name] = "uploaded";
    }
  });

  return updatedValues;
};

export const updatePdfForm = async (props: ICreateFormPdfProps) => {
  const { values, fileUrl, formData = {} } = props;

  const formPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  updateFiledsPdfForm(form, values, pdfDoc, formData);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  return blob;
};
