import React from "react";
import { useDrag } from "react-dnd";
import { Rnd } from "react-rnd";
import cn from "classnames";

import "./styles.scss";

import { IBuilderField, IResizedField } from "@/constants/types";
import { ICONS_MAP } from "@/icons";
import {
  customDragElementsClasses,
  customLargeFieldClasses as classes,
} from "@/PdfConstructor/constants";
import useCustomLargeField from "@/PdfConstructor/hooks/useCustomLargeField";

interface ICustomLargeFieldProps {
  field: IBuilderField;
  currentPage: Record<string, number>;
  isSelected?: boolean;
  parentRef: HTMLDivElement;
  onResizeField: ({ uuid, width, height, newX, newY }: IResizedField) => void;
  onSelect: (item: IBuilderField | null) => void;
}

const CustomLargeField = (props: ICustomLargeFieldProps) => {
  const { isSelected, field } = props;
  const {
    style,
    newSize,
    fieldRef,
    onSelectField,
    changeSize,
    handleUpdateField,
  } = useCustomLargeField(props);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: field.type,
      item: {
        field,
        type: field.type,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [field],
  );

  const renderFieldContent = React.useCallback(() => {
    switch (field.type) {
      case "checkbox":
        return <ICONS_MAP.CheckboxFieldIcon />;
      case "radio":
        return <ICONS_MAP.RadiobuttonFieldIcon />;
      case "dropdown":
        return (
          <div className={classes.dropdown}>
            {field.label} <ICONS_MAP.ChevronDownIcon />
          </div>
        );
      default:
        return field.label;
    }
  }, [field.type, field.label]);

  return (
    <Rnd
      style={style}
      size={{ width: newSize.width, height: newSize.height }}
      position={{ x: newSize.newX, y: newSize.newY }}
      onResize={changeSize}
      onResizeStop={handleUpdateField}
      disableDragging={true}
      enableResizing={{
        right: true,
        bottomRight: true,
        bottom: false,
        left: false,
        topLeft: false,
        topRight: false,
      }}
    >
      <div
        ref={fieldRef}
        className={cn(classes.container, {
          [`${classes.container}--selected `]: isSelected,
          [`${classes.container}--dragging`]: isDragging,
        })}
        style={{ width: `${newSize.width}px`, height: `${newSize.height}px` }}
      >
        <div
          ref={(node) => {
            drag(node);
          }}
          onClick={onSelectField}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelectField();
            }
          }}
          className={classes.body}
          style={{ width: `${newSize.width}px`, height: `${newSize.height}px` }}
        >
          <div
            className={cn(customDragElementsClasses.container, {
              [`${customDragElementsClasses.container}--error`]:
                field.formState?.showError,
              [`${customDragElementsClasses.container}--selected`]: isSelected,
              [`${customDragElementsClasses.container}--image`]:
                field.type === "image" || field.type === "signature",
              [`${customDragElementsClasses.container}--check`]:
                field.type === "checkbox" || field.type === "radio",
            })}
            style={{
              maxWidth: `${newSize.width}px`,
              height: `${newSize.height}px`,
              fontSize:
                field.type === "image" || field.type === "signature"
                  ? `${newSize.height / 3.5}px`
                  : `${newSize.height / 1.8}px`,
            }}
          >
            {renderFieldContent()}
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default CustomLargeField;
