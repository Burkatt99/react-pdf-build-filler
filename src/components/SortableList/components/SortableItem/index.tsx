import React from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import cn from "classnames";

import "./styles.scss";

import { ICONS_MAP } from "@/icons";

import { sortClasses } from "../../constants";

interface ISortableItemProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  disabled?: boolean;
  handle?: boolean;
  onDragging?: (isDragging: boolean) => void;
}

export const SortableItem = ({
  id,
  children,
  disabled,
  handle,
  onDragging,
}: ISortableItemProps) => {
  const { setNodeRef, listeners, transform, transition, isDragging } =
    useSortable({ id });

  React.useEffect(() => {
    if (isDragging && onDragging) {
      onDragging(true);
    }
  }, [isDragging]);

  if (disabled) {
    return children;
  }

  const style = {
    transition: transition || undefined,
    transform: transform
      ? `translate3d(${Math.round(transform.x)}px, ${Math.round(
          transform.y,
        )}px, 0)`
      : undefined,
    zIndex: isDragging ? 2 : 1,
  } as React.CSSProperties;

  return (
    <div
      className={cn(sortClasses.itemContent)}
      ref={setNodeRef}
      style={style}
      {...(handle ? {} : listeners)}
    >
      {handle && (
        <div {...listeners} className={cn(sortClasses.dragIcon)}>
          <ICONS_MAP.DragIcon />
        </div>
      )}
      {children}
    </div>
  );
};
