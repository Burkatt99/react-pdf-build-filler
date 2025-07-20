import React from "react";
import cn from "classnames";

import "./styles.scss";

import { TButtonTypes } from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";

import { buttonClasses } from "./constants";

export interface IButtonProps extends React.ComponentProps<"button"> {
  isLoading?: boolean;
  loading?: boolean;
  variant?: TButtonTypes;
  type?: "button" | "submit" | "reset";
  size?: "normall" | "small";
  className?: string;
  startIcon?: React.ReactNode;
  width?: string;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      children,
      variant = "primary",
      type = "button",
      size = "normall",
      startIcon,
      loading,
      className,
      width,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        type={type}
        className={cn(buttonClasses.container, className, {
          [`${buttonClasses.container}--${variant} ${className}--${variant}`]:
            variant,
          [`${buttonClasses.container}--small ${className}--small`]:
            size === "small",
        })}
        style={{
          fontSize: startIcon ? "14px" : "15px",
          padding: startIcon ? "0" : "8px 20px",
          width: startIcon ? "32px" : width || "fit-content",
          maxWidth: startIcon ? "32px" : width || "fit-content",
        }}
        {...rest}
        ref={ref}
      >
        {!loading && startIcon}
        {children && <div className={buttonClasses.content}>{children}</div>}
      </button>
    );
  },
);

export default appReactMemo(Button);
