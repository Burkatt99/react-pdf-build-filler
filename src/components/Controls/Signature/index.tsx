import React, { useCallback, useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import cn from "classnames";
import debounce from "lodash.debounce";

import "./styles.scss";

import Button from "@/components/Button";
import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";

import { signatureClasses } from "./constants";
import { ISignatureProps } from "./types";

const Signature = (props: ISignatureProps) => {
  const {
    value,
    label,
    disabled,
    errorMessage,
    classes,
    handleSignature,
    handleDeleteSignature,
  } = props;
  const [ref, setRef] = useState<SignatureCanvas | null>(null);
  const [isTouched, setIsTouched] = useState(false);

  const handleEnd = useCallback(
    debounce(() => {
      const dataURL = ref?.toDataURL();
      handleSignature?.(dataURL || "");
    }, 3000),
    [ref],
  );

  const handleClear = () => {
    ref?.clear();
    handleDeleteSignature?.();
  };

  useEffect(() => {
    if (ref && value) {
      ref.fromDataURL(value);
    }
  }, [value, ref]);

  return (
    <div
      className={cn(signatureClasses.field, classes?.field, {
        [`${signatureClasses.field}--touched ${classes?.field}--touched`]:
          isTouched,
        [`${signatureClasses.field}--error ${classes?.field}--error`]:
          !!errorMessage,
      })}
    >
      <div className={cn(signatureClasses.header, classes?.header)}>
        <div className={cn(signatureClasses.label, classes?.label)}>
          {label}
        </div>

        <Button
          variant="icon"
          onClick={handleClear}
          disabled={disabled}
          startIcon={<ICONS_MAP.ClearIcon />}
          className={cn(signatureClasses.clearButton, classes?.clearButton)}
        />
      </div>

      <SignatureCanvas
        penColor="black"
        ref={(value: SignatureCanvas) => setRef(value)}
        onBegin={() => (disabled ? ref?.off() : setIsTouched(true))}
        onEnd={handleEnd}
      />

      <div className={cn(signatureClasses.errorMessage, classes?.errorMessage)}>
        {errorMessage}
      </div>
    </div>
  );
};

export default appReactMemo(Signature);
