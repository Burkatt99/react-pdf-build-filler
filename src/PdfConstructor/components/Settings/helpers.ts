import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ISortOption } from "@/constants/types";

export type IBaseForm = {
  isRequired: boolean;
  fieldName: string;
  label: string;
  optionValue?: string;
  optionLabel?: string;
  condition?: string;
  isCellFormat?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
  sortOptions?: ISortOption[];
};

const createSchema = (type: string) => {
  const isDropdown = type === "dropdown";
  const isRadioOrPartlyDate = type === "radio" || type === "partlyDate";
  const requiredText = "This field is required";
  const camelCaseText = "The field should have camelCase format";
  const listRequiredText = "At least one item is required";

  return yup.object().shape({
    isRequired: yup.boolean().required(requiredText),
    fieldName: yup
      .string()
      .required(requiredText)
      .matches(/^[a-z]+(?:[A-Z][a-z]*)*$/, camelCaseText),
    label: yup.string().required(requiredText),
    optionValue: yup.string().when([], {
      is: () => isRadioOrPartlyDate,
      then: (schema) =>
        schema
          .required(requiredText)
          .matches(/^[a-z]+(?:[A-Z][a-z]*)*$/, camelCaseText),
      otherwise: (schema) => schema.notRequired(),
    }),
    optionLabel: yup.string().when([], {
      is: () => isRadioOrPartlyDate,
      then: (schema) => schema.required(requiredText),
      otherwise: (schema) => schema.notRequired(),
    }),
    condition: yup.string(),
    isCellFormat: yup.boolean(),
    minLength: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      ),
    maxLength: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .when("isCellFormat", {
        is: (isCellFormat: boolean) => !!isCellFormat,
        then: (schema) => schema.required(requiredText),
        otherwise: (schema) => schema.notRequired(),
      }),
    sortOptions: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().required(requiredText),
          label: yup.string().required(requiredText),
        }),
      )
      .when([], {
        is: () => isDropdown,
        then: (schema) =>
          schema.min(1, listRequiredText).required(listRequiredText),
        otherwise: (schema) => schema.notRequired(),
      }),
  });
};

export const getResolver = (type: string) => {
  const schema = createSchema(type);

  return yupResolver(schema);
};

export type SchemaType = yup.InferType<ReturnType<typeof createSchema>>;

export type FieldNames = keyof SchemaType;
