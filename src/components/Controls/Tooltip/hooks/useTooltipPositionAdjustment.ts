import { useEffect, useState } from "react";

import { TooltipPlacement } from "../types";

interface UseTooltipPositionAdjustmentProps {
  placement: TooltipPlacement;
  visible: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
  tooltipRef: React.RefObject<HTMLElement | null>;
  setContentSize: React.Dispatch<
    React.SetStateAction<{ height: number; width: number }>
  >;
}

const useTooltipPositionAdjustment = ({
  placement,
  visible,
  targetRef,
  tooltipRef,
  setContentSize,
}: UseTooltipPositionAdjustmentProps) => {
  const [adjustedPlacement, setAdjustedPlacement] =
    useState<TooltipPlacement>(placement);
  const [isStartPosition, setIsStartPosition] = useState(false);

  useEffect(() => {
    if (visible && tooltipRef.current && targetRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const targetRect = targetRef.current.getBoundingClientRect();

      const spaceAbove = targetRect.top;
      const spaceBelow = window.innerHeight - targetRect.bottom;
      const spaceLeft = targetRect.left;
      const spaceRight = window.innerWidth - targetRect.right;

      let newPlacement = placement;

      if (newPlacement === "top" && spaceAbove < tooltipRect.height) {
        newPlacement = "bottom";
      } else if (newPlacement === "bottom" && spaceBelow < tooltipRect.height) {
        newPlacement = "top";
      } else if (spaceLeft < tooltipRect.width) {
        setIsStartPosition(true);

        if (newPlacement === "left") {
          newPlacement = "right";
        }
      } else if (newPlacement === "right" && spaceRight < tooltipRect.width) {
        newPlacement = "left";
      }

      if (newPlacement !== placement) {
        setAdjustedPlacement(newPlacement);
        setContentSize({
          height: tooltipRect.height,
          width: tooltipRect.width,
        });
      }
    }
  }, [visible, placement, tooltipRef, targetRef]);

  return { adjustedPlacement, isStartPosition };
};

export default useTooltipPositionAdjustment;
