import React, { useState } from "react";
import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";

import { checkboxClasses } from "./constants";
import { ICheckboxProps } from "./types";

const Checkbox = ({
  label = "",
  name = "",
  initialChecked,
  checked,
  disabled = false,
  onChange,
  onClick,
  classes,
}: ICheckboxProps) => {
  const [isChecked, setIsChecked] = useState(!!initialChecked);

  const currentChecked = checked ?? isChecked;

  const onCheckboxChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
    },
    [onChange, checked],
  );

  return (
    <label
      className={cn(checkboxClasses.container, classes?.container, {
        [`${checkboxClasses.container}--disabled ${classes?.container}--disabled`]:
          disabled,
        [`${checkboxClasses.container}--checked ${classes?.container}--checked`]:
          currentChecked,
        [`${checkboxClasses.container}--unchecked ${classes?.container}--unchecked`]:
          !currentChecked,
        [`${checkboxClasses.container}--not-disabled ${classes?.container}--not-disabled`]:
          !disabled,
      })}
    >
      <input
        type="checkbox"
        name={name}
        checked={currentChecked}
        onChange={onCheckboxChange}
        onClick={onClick}
        disabled={disabled}
        className={cn(checkboxClasses.input, classes?.input)}
      />
      <div
        className={cn(checkboxClasses.checkIcon, classes?.checkIcon, {
          [`${checkboxClasses.checkIcon}--checked ${classes?.checkIcon}--checked`]:
            currentChecked,
        })}
      />
      {label && (
        <div className={cn(checkboxClasses.label, classes?.label)}>{label}</div>
      )}
    </label>
  );
};

export default appReactMemo(Checkbox);
