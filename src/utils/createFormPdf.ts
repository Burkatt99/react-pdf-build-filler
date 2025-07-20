import { PDFButton, PDFDocument, PDFHexString, PDFName, rgb } from "pdf-lib";

import { IBuilderField } from "@/constants/types";

interface ICreateFormPdf {
  fields: IBuilderField[];
  fileUrl: string;
  isUpdate?: boolean;
}

export const fieldByNames = (fields: IBuilderField[]) => {
  return fields.reduce(
    (acc, field) => {
      if (field.name) {
        if (!acc[field.name]) {
          acc[field.name] = [];
        }
        acc[field.name].push(field);
      }
      return acc;
    },
    {} as Record<string, IBuilderField[]>,
  );
};

export const createFormPdf = async (props: ICreateFormPdf) => {
  const { fields, fileUrl, isUpdate = false } = props;

  const formPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();
  const pages = pdfDoc.getPages();

  if (isUpdate) {
    form.getFields().forEach((field) => {
      form.removeField(field);
    });
  }

  const radioFields = fields.filter((field) => field.type === "radio");
  const partlyDateFields = fields.filter(
    (field) => field.type === "partlyDate",
  );

  fields.forEach(
    async ({
      type,
      y,
      x,
      page,
      height,
      width,
      validation,
      name,
      sortOptions,
    }) => {
      const pageHeight = pages[page].getHeight();
      const yPosition = pageHeight - y - height;

      if (
        type === "text" ||
        type === "number" ||
        type === "date" ||
        type === "country"
      ) {
        const textField = form.createTextField(name);

        if (validation.maxLength) {
          textField.setMaxLength(validation.maxLength);
        }

        if (validation.isCellFormat && validation.maxLength) {
          textField.setMaxLength(validation.maxLength);
          textField.enableCombing();
        }

        textField.addToPage(pages[page], {
          x: x,
          y: yPosition,
          width: width,
          height: height,
          textColor: rgb(0, 0, 0),
          backgroundColor: undefined,
          borderColor: undefined,
          borderWidth: 0,
        });
        textField.setFontSize(10);
      } else if (type === "checkbox") {
        const checkBoxField = form.createCheckBox(name);

        checkBoxField.addToPage(pages[page], {
          x: x,
          y: yPosition,
          width: width,
          height: height,
          borderWidth: 0,
          backgroundColor: undefined,
        });
      } else if (type === "dropdown") {
        const dropdownField = form.createDropdown(name);
        const optionList = sortOptions?.map((option) => option.label);

        if (optionList?.length) {
          dropdownField.addOptions(optionList);

          dropdownField.addToPage(pages[page], {
            x: x,
            y: yPosition,
            width: width,
            height: height,
            textColor: rgb(0, 0, 0),
            backgroundColor: undefined,
            borderColor: undefined,
            borderWidth: 0,
          });
          dropdownField.setFontSize(10);
        }
      } else if (type === "signature") {
        const imageField = form.getFieldMaybe(name) as PDFButton;

        if (!imageField?.ref) {
          const newImageField = form.createButton(name) as PDFButton;

          newImageField.addToPage("", pages[page], {
            x: x,
            y: yPosition,
            width: width,
            height: height,
            borderWidth: 0,
            backgroundColor: rgb(1, 1, 1),
          });

          // add action to button
          newImageField.acroField.getWidgets().forEach((widget) => {
            widget.dict.set(
              PDFName.of("AA"), // Set the additional actions dictionary
              pdfDoc.context.obj({
                U: {
                  Type: "Action",
                  S: "JavaScript",
                  JS: PDFHexString.fromText(""), // empty JavaScript
                },
              }),
            );
          });
        } else {
          imageField.addToPage("", pages[page], {
            x: x,
            y: yPosition,
            width: width,
            height: height,
            borderWidth: 0,
            backgroundColor: rgb(1, 1, 1),
          });

          imageField.acroField.getWidgets().forEach((widget) => {
            widget.dict.set(
              PDFName.of("AA"), // Set the additional actions dictionary
              pdfDoc.context.obj({
                U: {
                  Type: "Action",
                  S: "JavaScript",
                  JS: PDFHexString.fromText(""), // Порожній JavaScript
                },
              }),
            );
          });
        }
      }
    },
  );

  // add text fields for partly date
  if (partlyDateFields.length) {
    const partlyDateByName = fieldByNames(partlyDateFields);

    Object.keys(partlyDateByName).forEach((name) => {
      partlyDateByName[name].forEach(
        ({ x, page, y, width, height, option }) => {
          const pageHeight = pages[page].getHeight();
          const yPosition = pageHeight - y - height;

          const textField = form.createTextField(option?.label || "");

          switch (option?.value) {
            case "day":
            case "month":
              textField.setMaxLength(2);
              break;
            case "year":
              textField.setMaxLength(4);
              break;
            default:
              break;
          }
          textField.enableCombing();

          textField.addToPage(pages[page], {
            x: x,
            y: yPosition,
            width: width,
            height: height,
            textColor: rgb(0, 0, 0),
            backgroundColor: undefined,
            borderColor: undefined,
            borderWidth: 0,
          });
          textField.setFontSize(10);
        },
      );
    });
  }

  // add radio buttons
  if (radioFields.length) {
    const radioByName = fieldByNames(radioFields);

    Object.keys(radioByName).forEach((name) => {
      radioByName[name].forEach(({ x, page, y, width, height, option }) => {
        const pageHeight = pages[page].getHeight();
        const yPosition = pageHeight - y - height;

        const nameOfField = `${name}_${option?.value}`;

        const checkField = form.createCheckBox(nameOfField);

        checkField.addToPage(pages[page], {
          x: x,
          y: yPosition,
          width: width,
          height: height,
          borderWidth: 0,
          backgroundColor: undefined,
        });
      });
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  return blob;
};
