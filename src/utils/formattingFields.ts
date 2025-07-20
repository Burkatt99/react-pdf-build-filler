import { IBuilderField, ICustomFieldByRole } from "@/constants/types";

export const typeFieldsList = {
  text: "STRING",
  number: "NUMBER",
  date: "DATE",
  radio: "SELECT",
  checkbox: "CHECKBOX",
  signature: "SIGNATURE",
  image: "IMAGE",
  country: "COUNTRY",
  partlyDate: "PARTLY_DATE",
  dropdown: "DROPDOWN",
};

export const formattingFields = (fields: IBuilderField[]) => {
  const fieldsByRole = fields.reduce(
    (acc, field) => {
      if (field.role) {
        if (!acc[field.role]) {
          acc[field.role] = [];
        }
        acc[field.role].push(field);
      }
      return acc;
    },
    {} as Record<string, IBuilderField[]>,
  );

  const formattedFieldsByRole = Object.keys(fieldsByRole).reduce(
    (acc, role) => {
      const processedPartlyNames = new Set<string>();
      const processedSignatureNames = new Set<string>();

      const fieldsInRole = fieldsByRole[role]
        .map((field, index) => {
          if (field.type === "radio" || field.type === "partlyDate") {
            if (processedPartlyNames.has(field.name)) {
              return null;
            }

            const partlyValues = fieldsByRole[role].filter(
              (item) => item.name === field.name,
            );

            processedPartlyNames.add(field.name);

            return {
              name: field.name,
              label: field.label,
              sortingId: index + 1,
              type: typeFieldsList[field.type],
              options: partlyValues.map(({ option }) => ({
                value: option?.value ?? "",
                label: option?.label || "",
              })),
              validation: { ...field.validation },
            };
          } else if (field.type === "signature") {
            if (processedSignatureNames.has(field.name)) {
              return null;
            }

            processedSignatureNames.add(field.name);

            return {
              name: field.name,
              label: field.label,
              sortingId: index + 1,
              type: typeFieldsList[field.type],
              validation: { ...field.validation },
            };
          } else if (field.type === "image") {
            return {
              name: field.name,
              label: field.label,
              sortingId: index + 1,
              type: typeFieldsList[field.type],
              validation: { ...field.validation },
              position: {
                x: field.x,
                y: field.y,
                height: field.height,
                width: field.width,
                page: field.page,
              },
            };
          } else if (field.type === "dropdown") {
            return {
              name: field.name,
              label: field.label,
              sortingId: index + 1,
              type: typeFieldsList[field.type],
              options: field.sortOptions?.map((option) => ({
                value: option.value,
                label: option.label,
              })),
              validation: { ...field.validation },
            };
          } else {
            return {
              name: field.name,
              label: field.label,
              sortingId: index + 1,
              type: typeFieldsList[field.type],
              validation: { ...field.validation },
            };
          }
        })
        .filter((item) => item !== null) as ICustomFieldByRole[];

      acc[role] = fieldsInRole;
      return acc;
    },
    {} as Record<string, ICustomFieldByRole[]>,
  );

  return formattedFieldsByRole;
};
