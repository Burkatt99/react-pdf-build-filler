import { useEffect, useMemo } from "react";
import { ConnectDragPreview, DragPreviewOptions } from "react-dnd";

const useEmptyImagePreview = (preview: ConnectDragPreview) => {
  const emptyImage = useMemo(() => {
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    return img;
  }, []);

  useEffect(() => {
    preview(emptyImage, { captureDraggingState: true } as DragPreviewOptions);
  }, [preview, emptyImage]);
};

export default useEmptyImagePreview;
