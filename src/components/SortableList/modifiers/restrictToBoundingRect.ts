import type { ClientRect } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";

import { SHADOW_SHIFT } from "../constants";

export const restrictToBoundingRect = (
  transform: Transform,
  rect: ClientRect,
  boundingRect: ClientRect,
): Transform => {
  const value = {
    ...transform,
  };

  if (rect.top + transform.y <= boundingRect.top + SHADOW_SHIFT) {
    value.y = boundingRect.top - rect.top + SHADOW_SHIFT;
  } else if (
    rect.bottom + transform.y >=
    boundingRect.top + boundingRect.height - SHADOW_SHIFT
  ) {
    value.y =
      boundingRect.top + boundingRect.height - rect.bottom - SHADOW_SHIFT;
  }

  if (rect.left + transform.x <= boundingRect.left + SHADOW_SHIFT) {
    value.x = boundingRect.left - rect.left + SHADOW_SHIFT;
  } else if (
    rect.right + transform.x >=
    boundingRect.left + boundingRect.width - SHADOW_SHIFT
  ) {
    value.x =
      boundingRect.left + boundingRect.width - rect.right - SHADOW_SHIFT;
  }

  return value;
};
