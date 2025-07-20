import React, { useCallback, useEffect, useRef } from "react";
import { ConnectDragSource, useDrag } from "react-dnd";
import { Position } from "react-rnd";

import { IBuilderField, IResizedField } from "@/constants/types";
import useOutsideClick from "@/hooks/useOutsideClick";

type UseCustomLargeFieldProps = {
  field: IBuilderField;
  currentPage: Record<string, number>;
  parentRef: HTMLDivElement;
  onResizeField: ({ uuid, width, height, newX, newY }: IResizedField) => void;
  onSelect: (item: IBuilderField | null) => void;
};

interface UseCustomLargeField {
  drag: ConnectDragSource;
  isDragging: boolean;
  style: React.CSSProperties;
  newSize: Record<string, number>;
  fieldRef: React.RefObject<HTMLDivElement | null>;
  onSelectField: () => void;
  changeSize: (
    e: any,
    direction: string,
    ref: any,
    delta: any,
    position: Position,
  ) => void;
  handleUpdateField: () => void;
}

const useCustomLargeField = (
  props: UseCustomLargeFieldProps,
): UseCustomLargeField => {
  const {
    field,
    currentPage: { scale },
    parentRef,
    onSelect,
    onResizeField,
  } = props;
  const fieldRef = useRef<HTMLDivElement>(null);
  const [newSize, setNewSize] = React.useState({
    width: 0,
    height: 0,
    newX: 0,
    newY: 0,
  });

  useEffect(() => {
    const relativeX = field.x * scale;
    const relativeY = field.y * scale;
    const relativeWidth = field.width * scale;
    const relativeHeight = field.height * scale;

    setNewSize({
      width: relativeWidth,
      height: relativeHeight,
      newX: relativeX,
      newY: relativeY,
    });
  }, [field, scale]);

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

  const onSelectField = useCallback(() => {
    onSelect(field);
  }, [onSelect, field]);

  const changeSize = useCallback(
    (e: any, direction: string, ref: any, delta: any, position: Position) => {
      const newWidth = ref.offsetWidth;
      const newHeight = ref.offsetHeight;
      const isChangeRight =
        direction.includes("right") || direction.includes("bottomRight");
      const isChangeBottom =
        direction.includes("bottom") || direction.includes("bottomRight");

      setNewSize((prevSize) => ({
        ...prevSize,
        width: isChangeRight ? newWidth : prevSize.width,
        height: isChangeBottom ? newHeight : prevSize.height,
        newX: isChangeRight ? position.x : prevSize.newX,
        newY: isChangeBottom ? position.y : prevSize.newY,
      }));
    },
    [],
  );

  const handleUpdateField = useCallback(() => {
    const { width, height, newX, newY } = newSize;

    onResizeField({
      uuid: field.uuid,
      width: width / scale,
      height: height / scale,
      newX: newX / scale,
      newY: newY / scale,
    });
  }, [newSize, onResizeField, field.uuid]);

  useOutsideClick({
    cb: (e: MouseEvent) => {
      if (parentRef && parentRef.contains(e.target as Node)) {
        onSelect(null);
      }
    },
    element: fieldRef.current,
    dependencies: [fieldRef, parentRef, onSelect],
  });

  const style = {
    position: "absolute" as const,
    display: "flex" as const,
    zIndex: 10,
  };

  return {
    drag,
    isDragging,
    style,
    newSize,
    fieldRef,
    onSelectField,
    changeSize,
    handleUpdateField,
  };
};

export default useCustomLargeField;
