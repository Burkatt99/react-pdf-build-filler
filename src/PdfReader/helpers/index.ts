import * as yup from "yup";

import { ICustomFieldByRole } from "@/constants/types";

export const createValidationSchema = (fields: ICustomFieldByRole[]) => {
  const fieldValidations = fields.reduce(
    (acc, field) => {
      const { name, type, validation } = field;
      const { isRequired, minLength, maxLength, condition } = validation;
      const requiredText = "This field is required";

      let validator: yup.AnySchema = yup.string();

      switch (type) {
        case "NUMBER": {
          validator = yup.string().when([], {
            is: () => minLength !== undefined,
            then: (schema) =>
              schema
                .typeError("validations.number")
                .min(
                  minLength!,
                  `This field must be at least ${minLength} characters`,
                ),
            otherwise: (schema) => schema,
          });

          validator = yup.string().when([], {
            is: () => maxLength !== undefined,
            then: (schema) =>
              schema
                .typeError("validations.number")
                .max(
                  maxLength!,
                  `This field must be no more than ${maxLength} characters`,
                ),
            otherwise: (schema) => schema,
          });
          break;
        }
        case "DATE":
        case "PARTLY_DATE":
          validator = yup.date();
          break;
        case "CHECKBOX":
          validator = yup.boolean();
          break;
        default: {
          validator = yup.string().when([], {
            is: () => minLength !== undefined,
            then: (schema) =>
              schema
                .typeError(requiredText)
                .min(
                  minLength!,
                  `This field must be at least ${minLength} characters`,
                ),
            otherwise: (schema) => schema,
          });

          validator = yup.string().when([], {
            is: () => maxLength !== undefined,
            then: (schema) =>
              schema
                .typeError(requiredText)
                .max(
                  maxLength!,
                  `This field must be no more than ${maxLength} characters`,
                ),
            otherwise: (schema) => schema,
          });
          break;
        }
      }

      if (isRequired) {
        validator = validator.required(requiredText);
      }
      if (condition) {
        validator = validator.when(condition.split(".")[0], {
          is: (value: string) => {
            if (condition.includes(".")) {
              const [_otherField, expectedValue] = condition.split(".");
              return value === expectedValue;
            }

            return Boolean(value);
          },
          then: (schema) => schema.required(requiredText),
          otherwise: (schema) => schema.notRequired(),
        });
      }

      acc[name] = validator;

      return acc;
    },
    {} as { [key: string]: yup.AnySchema },
  );

  return yup.object().shape(fieldValidations);
};
