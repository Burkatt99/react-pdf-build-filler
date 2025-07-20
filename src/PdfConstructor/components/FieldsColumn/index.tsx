import { useEffect, useRef } from "react";
import cn from "classnames";

import "./styles.scss";

import { ICustomField } from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";
import { fieldsColumnClasses } from "@/PdfConstructor/constants";
import useFieldsColumn from "@/PdfConstructor/hooks/useFieldsColumn";
import { CustomFieldClasses } from "@/PdfConstructor/types";

import CustomField from "../CustomField";

interface IFieldsColumnProps {
  customFieldsList: ICustomField[];
  classes?: CustomFieldClasses;
  onRemoveField: (uuid: string) => void;
}

const FieldsColumn = (props: IFieldsColumnProps) => {
  const { customFieldsList, classes, onRemoveField } = props;
  const dropRef = useRef(null);

  const { drop, isMoving, isOver } = useFieldsColumn({
    onRemoveField,
  });

  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef.current);
    }
  }, [drop, dropRef]);

  return (
    <div ref={dropRef} className={fieldsColumnClasses.container}>
      <div
        className={cn(fieldsColumnClasses.removeHelper, {
          [`${fieldsColumnClasses.removeHelper}--moving`]: isMoving,
          [`${fieldsColumnClasses.removeHelper}--over`]: isOver,
        })}
      >
        <ICONS_MAP.DeleteIcon />
        <div>{"Drag & Drop to remove"}</div>
      </div>

      <div
        className={cn(fieldsColumnClasses.fieldsList, {
          [`${fieldsColumnClasses.fieldsList}--moving`]: isMoving,
        })}
      >
        <div className={fieldsColumnClasses.columnTitle}>
          {"Add fillable fields"}
        </div>
        {customFieldsList.map((customField) => (
          <CustomField
            key={customField.uuid}
            classes={classes}
            field={{ ...customField, customPreview: true }}
          />
        ))}
      </div>
    </div>
  );
};

export default appReactMemo(FieldsColumn);
