import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import useOutsideClick from "@/hooks/useOutsideClick";

import { TooltipPlacement, TriggerType } from "../types";

import useTooltipPositionAdjustment from "./useTooltipPositionAdjustment";

type UseTooltipProps = {
  trigger: TriggerType;
  open?: boolean;
  defaultPlacement: TooltipPlacement;
  onOpen?: () => void;
};

const useTooltip = (props: UseTooltipProps) => {
  const { trigger, open, defaultPlacement, onOpen } = props;
  const targetRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [stylePosition, setStylePosition] = useState<{
    top?: string;
    left?: string;
    right?: string;
    transform?: string;
  }>({ top: "", left: "", right: "", transform: "" });

  const [placement, setPlacement] =
    useState<TooltipPlacement>(defaultPlacement);
  const [contentSize, setContentSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [targetSize, setTargetSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const { adjustedPlacement, isStartPosition } = useTooltipPositionAdjustment({
    placement,
    visible,
    targetRef,
    tooltipRef,
    setContentSize,
  });

  const handleClick = useCallback(() => {
    if (trigger === "click") {
      setVisible((prev) => !prev);
      onOpen?.();
    }
  }, [trigger, onOpen]);

  const handleMouseEnter = useCallback(() => {
    if (trigger === "hover") {
      setVisible(true);
      onOpen?.();
    }
  }, [trigger, onOpen]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === "hover") setVisible(false);
  }, [trigger]);

  useOutsideClick({
    cb: (e) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    },
    element: tooltipRef.current,
    dependencies: [visible],
  });

  useEffect(() => {
    if (open !== undefined) setVisible(open);
  }, [open]);

  useLayoutEffect(() => {
    if (targetRef.current && visible) {
      const rect = targetRef.current.getBoundingClientRect();
      setTargetSize({ width: rect.width, height: rect.height });
    }

    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      setContentSize({ width: rect.width, height: rect.height });
    }
  }, [targetRef.current, visible, tooltipRef.current]);

  useEffect(() => {
    setPlacement(adjustedPlacement);
  }, [adjustedPlacement]);

  useEffect(() => {
    let top = undefined;
    let left = undefined;
    let right = undefined;
    let transform = undefined;

    if (placement === "top") {
      top = `-${contentSize.height}px`;

      if (isStartPosition) {
        transform = `translateX(0)`;
      }
    } else if (placement === "bottom") {
      top = `${targetSize.height}px`;

      if (isStartPosition) {
        transform = `translateX(0)`;
      }
    } else if (placement === "right") {
      left = `${targetSize.width + 5}px`;
      transform = `translateY(-${(contentSize.height - targetSize.height) / 2}px)`;
    } else if (placement === "left") {
      right = `${targetSize.width - 5}px`;
      transform = `translateY(-${(contentSize.height - targetSize.height) / 2}px)`;
    }

    setStylePosition({
      top,
      left,
      right,
      transform,
    });
  }, [contentSize, targetSize, placement, isStartPosition]);

  return {
    targetRef,
    tooltipRef,
    stylePosition,
    placement: adjustedPlacement,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    triggerRef,
    visible,
  };
};

export default useTooltip;
