import { format, parse } from "date-fns";
import { PDFDocument, PDFForm } from "pdf-lib";

import { ICustomFieldByRole } from "@/constants/types";

import { IFileForm } from "../constants/types";

import { extractBase64Data } from "./extractBase64";
import { getFormattedCountry } from "./getFormattedCountry";

export const updateFiledsPdfForm = (
  form: PDFForm,
  values: IFileForm,
  pdfDoc: PDFDocument,
  formData: Record<string, ICustomFieldByRole[]>,
) => {
  const fields = form.getFields();
  const pages = pdfDoc.getPages();
  const formDataFields = Object.values(formData).flat();

  const imageValues = formDataFields.filter((item) => item.type === "IMAGE");
  const radioValues = formDataFields
    .filter((item) => item.type === "SELECT")
    .map((item) => ({
      name: item.name,
      options: item?.options?.map((option) => option.value),
    }));
  const partlyDateValues = formDataFields
    .filter((item) => item.type === "PARTLY_DATE")
    .map((item) => ({
      name: item.name,
      options: item?.options?.reduce(
        (acc, option) => ({
          ...acc,
          [option.label]: option.value as string,
        }),
        {} as { [key: string]: string },
      ),
    }));

  fields.forEach(async (field) => {
    const name = field.getName();

    const fieldData = formDataFields.find((item) => item.name === name);
    const radioValue = radioValues.find((field) => name.includes(field?.name));
    const fieldRadioName = values[radioValue?.name || ""]
      ? `${radioValue?.name}_${values[radioValue?.name || ""]}`
      : "";
    const partlyDateValue = partlyDateValues.find(
      (field) => field?.options?.[name] !== undefined,
    );

    if (values[name] || radioValue || partlyDateValue) {
      switch (fieldData?.type) {
        case "STRING":
        case "NUMBER":
          form.getTextField(name).setText(values[name] as string);
          break;
        case "COUNTRY":
          form
            .getTextField(name)
            .setText(getFormattedCountry(values[name] as string));
          break;
        case "DATE":
          {
            const formatOfDate = fieldData.validation.isCellFormat
              ? "ddMMyyyy"
              : "dd.MM.yyyy";

            const formattedDate = format(
              new Date(values[name] as string),
              formatOfDate,
            );
            form.getTextField(name).setText(formattedDate);
          }
          break;
        case "CHECKBOX":
          if (values[name]) {
            form.getCheckBox(name).check();
          } else {
            form.getCheckBox(name).uncheck();
          }
          break;
        case "SIGNATURE":
          {
            if (values[name]) {
              const newValue = await extractBase64Data(
                pdfDoc,
                values[name] as string,
              );

              form.getButton(name).setImage(newValue);
            }
          }
          break;
        case "DROPDOWN":
          form.getDropdown(name).select(values[name] as string);
          break;
        case "IMAGE": {
          if (values[name]) {
            const newValue = await extractBase64Data(
              pdfDoc,
              values[name] as string,
            );

            form.getButton(name).setImage(newValue);
          }

          break;
        }
        default:
          {
            if (values[partlyDateValue?.name || ""]) {
              const date = values[partlyDateValue?.name || ""] as string;
              const parsedDate = parse(date, "yyyy-MM-dd", new Date()); // форматуємо вхідний рядок
              const dateObject: { [key: string]: string } = {
                day: format(parsedDate, "dd"),
                month: format(parsedDate, "MM"),
                year: format(parsedDate, "yyyy"),
              };

              const partOfDay = partlyDateValue?.options?.[name] || "";
              const fieldValue = dateObject[partOfDay];

              form.getTextField(name).setText(fieldValue);
            }

            if (fieldRadioName) {
              form.getCheckBox(fieldRadioName as string).check();
            }
          }
          break;
      }
    }
  });

  if (imageValues) {
    imageValues.forEach(async (field) => {
      const { name } = field;
      const imageField = form.getFieldMaybe(name);

      if (values[name] && !imageField?.ref) {
        const newValue = await extractBase64Data(
          pdfDoc,
          values[name] as string,
        );

        const imageField = form.createButton(name);
        const position = field.position;

        if (position) {
          const pageHeight = pages[position.page].getHeight();
          const yPosition = pageHeight - position.y - position.height;

          imageField.addToPage("", pages[position.page], {
            x: position.x,
            y: yPosition,
            width: position.width,
            height: position.height,
            borderWidth: 0,
            backgroundColor: undefined,
          });

          imageField.setImage(newValue);
        }
      }
    });
  }
};
