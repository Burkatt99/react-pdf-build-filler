import React from "react";
import { useDragLayer } from "react-dnd";
import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";
import { customDragElementsClasses } from "@/PdfConstructor/constants";

const CustomDragElement = () => {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    (monitor) => ({
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
      isDragging: monitor.isDragging(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
    }),
  );

  if (!isDragging || !currentOffset) {
    return null;
  }

  const { x, y } = currentOffset;

  const renderFieldContent = () => {
    switch (item.type) {
      case "checkbox":
        return <ICONS_MAP.CheckboxFieldIcon />;
      case "radio":
        return <ICONS_MAP.RadiobuttonFieldIcon />;
      case "dropdown":
        return (
          <div className={customDragElementsClasses.dropdown}>
            {item.placeholder} <ICONS_MAP.ChevronDownIcon />
          </div>
        );
      default:
        return item.placeholder;
    }
  };

  const layerStyles: React.CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    left: 0,
    top: 0,
    transform: `translate(${x}px, ${y}px)`,
    zIndex: 100,
  };

  return (
    <div style={layerStyles}>
      {!!item.customPreview && (
        <div
          className={cn(customDragElementsClasses.container, {
            [`${customDragElementsClasses.container}--error`]: item.showError,
            [`${customDragElementsClasses.container}--image`]:
              itemType === "image" || itemType === "signature",
            [`${customDragElementsClasses.container}--check`]:
              itemType === "checkbox" || itemType === "radio",
          })}
          style={{
            maxWidth: `${item.width}px`,
            height: `${item.height}px`,
            fontSize: `${item.height / 1.5}px`,
            width: item.customPreview ? `${item.width}px` : undefined,
          }}
        >
          {renderFieldContent()}
        </div>
      )}
    </div>
  );
};

export default appReactMemo(CustomDragElement);
