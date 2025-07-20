import React from "react";
import {
  DndContext,
  DragEndEvent,
  Modifiers,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, SortingStrategy } from "@dnd-kit/sortable";
import classNames from "classnames";

import { appReactMemo } from "@/hocs/appReactMemo";

import { sortClasses } from "./constants";

interface ISortableListProps {
  list: UniqueIdentifier[];
  modifiers?: Modifiers;
  strategy?: SortingStrategy;
  onSort: (values: UniqueIdentifier[]) => void;
  disabled?: boolean;
  withContent?: boolean;
  overflow?: boolean;
  children: React.ReactNode;
  className?: string;
}

const SortableList = ({
  list,
  modifiers,
  strategy,
  onSort,
  disabled,
  className,
  withContent,
  overflow = true,
  children,
}: ISortableListProps) => {
  if (disabled) {
    return children;
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active) {
      onSort(arrayMove(list, list.indexOf(active.id), list.indexOf(over.id)));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={modifiers}>
      <SortableContext items={list} strategy={strategy}>
        <div
          className={classNames(sortClasses.content, className, {
            [`${sortClasses.content}--withContent ${className}--withContent`]:
              withContent,
            [`${sortClasses.content}--overflow ${className}--overflow`]:
              overflow,
          })}
        >
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
};
export default appReactMemo(SortableList);
