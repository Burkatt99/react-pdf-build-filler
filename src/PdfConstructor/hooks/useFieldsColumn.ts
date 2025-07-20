import { ConnectDropTarget, useDrop } from "react-dnd";

import { acceptFieldsList } from "@/constants/customFields";
import { IBuilderField } from "@/constants/types";

type UseFieldsColumnProps = {
  onRemoveField: (uuid: string) => void;
};

type UseFieldsColumn = {
  isMoving: boolean;
  isOver: boolean;
  drop: ConnectDropTarget;
};

const useFieldsColumn = ({
  onRemoveField,
}: UseFieldsColumnProps): UseFieldsColumn => {
  const [{ isMoving, isOver }, drop] = useDrop(
    () => ({
      accept: acceptFieldsList,
      drop: (item: { field: IBuilderField }, monitor) => {
        if (!monitor.didDrop()) {
          onRemoveField(item.field.uuid as string);
        }
      },
      collect: (monitor) => ({
        isMoving:
          !!monitor.getItem() &&
          acceptFieldsList.includes(monitor.getItemType() as string),
        isOver: monitor.isOver(),
      }),
    }),
    [onRemoveField],
  );

  return {
    drop,
    isMoving,
    isOver,
  };
};

export default useFieldsColumn;
