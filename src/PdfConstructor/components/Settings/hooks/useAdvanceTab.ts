import { useCallback } from "react";

import {
  cellFormatFieldList,
  excludemaxLengthFieldList,
} from "@/constants/advance";
import { usePdfConstructor } from "@/context";
import { formatterLabel } from "@/utils/formatterLabel";

type UseAdvanceTabType = {
  showCellFormat: boolean;
  showLengthFields: boolean;
  getConditionOptions: () => { label: string; value: string }[];
};

const useAdvanceTab = (): UseAdvanceTabType => {
  const { selectedField: selected, allFields } = usePdfConstructor();
  const showCellFormat = cellFormatFieldList.includes(selected?.type as string);
  const showLengthFields = !excludemaxLengthFieldList.includes(
    selected?.type as string,
  );

  const getConditionOptions = useCallback(() => {
    const filterFields = allFields.filter(
      (field) => field.name !== selected?.name,
    );

    const seenPartlyDate = new Set();

    return filterFields
      .filter(({ name, type }) => {
        if (type === "partlyDate") {
          if (seenPartlyDate.has(name)) {
            return false;
          }
          seenPartlyDate.add(name);
        }
        return true;
      })
      .map(({ name, option, type }) => {
        if (type === "radio") {
          return {
            label: `${formatterLabel(name)} - ${formatterLabel(option?.value as string)}`,
            value: `${name}.${option?.value}`,
          };
        }

        return {
          label: formatterLabel(name),
          value: name,
        };
      });
  }, [allFields, selected?.name]);

  return {
    showCellFormat,
    showLengthFields,
    getConditionOptions,
  };
};

export default useAdvanceTab;
