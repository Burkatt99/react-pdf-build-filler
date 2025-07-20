import React from "react";
import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";

import Tooltip from "../Tooltip";

import { ellipsisText, inputClasses } from "./constants";
import { IInputProps } from "./types";

const Input = ({
  label = "",
  inputStyles,
  required,
  error,
  endIcon,
  enableCopyToClipboard = false,
  enableEllipsisText = false,
  shrinkStart = 5,
  shrinkEnd = 5,
  value: initialValue,
  inputRef,
  errorMessage,
  tooltipLabel,
  placeholder,
  className,
  onBlur,
  onChange,
  classes,
  customLabel,
  ...rest
}: IInputProps) => {
  const ref = React.useRef<HTMLInputElement>(null);

  const currentRef = inputRef || ref;
  let value = initialValue;

  if (initialValue && enableEllipsisText) {
    value = ellipsisText(String(initialValue), shrinkStart, shrinkEnd);
  }

  const onFocusHandler = () => {
    if (!rest.disabled) {
      currentRef.current?.focus();
    }
  };

  const onBlurHandler: React.FocusEventHandler<HTMLInputElement> = (e) => {
    onBlur?.(e);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const renderIcon = () => {
    if (!endIcon) {
      return null;
    }

    return (
      <div
        data-icon-wrapper="end"
        className={cn(inputClasses.iconWrapper, classes?.iconWrapper, {
          [`${inputClasses.iconWrapper}--end ${classes?.iconWrapper}--end`]:
            !!endIcon,
        })}
      >
        {endIcon}
      </div>
    );
  };

  const renderLabel = () => {
    if (tooltipLabel) {
      return (
        <label className={cn(inputClasses.labelTooltip, classes?.labelTooltip)}>
          {customLabel || label}
          <Tooltip content={tooltipLabel} defaultPlacement="right">
            <div className={cn(inputClasses.tooltipIcon, classes?.tooltipIcon)}>
              <ICONS_MAP.HelpCircleIcon />
            </div>
          </Tooltip>
        </label>
      );
    }

    if (label) {
      return (
        <label
          className={cn(inputClasses.label, classes?.label, {
            [`${inputClasses.label}--disabled ${classes?.label}--disabled`]:
              rest.disabled,
            [`${inputClasses.label}--required ${classes?.label}--required`]:
              required,
          })}
        >
          {label}
        </label>
      );
    }
  };

  return (
    <div className={cn(className, inputClasses.container, classes?.container)}>
      {renderLabel()}
      <div
        role="button"
        tabIndex={0}
        className={cn(inputClasses.body, classes?.body)}
        onClick={onFocusHandler}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onFocusHandler();
          }
        }}
      >
        <input
          {...rest}
          ref={currentRef}
          value={value}
          onChange={onChangeHandler}
          placeholder={placeholder}
          style={inputStyles}
          onBlur={onBlurHandler}
          className={cn(inputClasses.input, classes?.input, {
            [`${inputClasses.input}--isClipboard ${classes?.input}--isClipboard`]:
              enableCopyToClipboard,
            [`${inputClasses.input}--error ${classes?.input}--error`]: error,
          })}
        />
        {renderIcon()}

        <div className={cn(inputClasses.error, classes?.error)}>
          {error && errorMessage}
        </div>
      </div>
    </div>
  );
};

export default appReactMemo(Input);
