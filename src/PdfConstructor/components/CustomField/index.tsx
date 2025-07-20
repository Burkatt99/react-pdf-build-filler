import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import cn from "classnames";

import "./styles.scss";

import { bigIcons, lisfOfImageTypes } from "@/constants/fieldIcons";
import { ICustomField } from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";
import useEmptyImagePreview from "@/hooks/useEmptyImagePreview";
import { ICONS_MAP } from "@/icons";
import { customFieldClasses } from "@/PdfConstructor/constants";
import { CustomFieldClasses } from "@/PdfConstructor/types";

type TCustomFieldProps = {
  field: ICustomField;
  classes?: CustomFieldClasses;
};

const CustomField = ({ field, classes }: TCustomFieldProps) => {
  const { name, type, width, height, placeholder, customPreview } = field;
  const dragRef = useRef<HTMLDivElement | null>(null);

  const [_, drag, preview] = useDrag(() => ({
    type,
    item: {
      type,
      width,
      height,
      placeholder,
      customPreview,
    },
  }));

  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current);
    }
  }, [drag, preview]);

  useEmptyImagePreview(preview);

  return (
    <div className={cn(customFieldClasses.container, classes?.container)}>
      <div
        className={cn(customFieldClasses.iconBlock, classes?.iconBlock, {
          [`${customFieldClasses.iconBlock}--big ${classes?.iconBlock}--big`]:
            bigIcons.includes(type),
        })}
      >
        {lisfOfImageTypes[type]}
      </div>
      <div className={cn(customFieldClasses.name, classes?.name)}>{name}</div>

      <div
        ref={dragRef}
        className={cn(customFieldClasses.dragIcon, classes?.dragIcon)}
      >
        <ICONS_MAP.DragIcon />
      </div>
    </div>
  );
};

export default appReactMemo(CustomField);
