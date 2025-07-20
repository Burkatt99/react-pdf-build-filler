export type InputClasses = {
  container?: string;
  body?: string;
  error?: string;
  label?: string;
  labelTooltip?: string;
  tooltipIcon?: string;
  labelPlaceholder?: string;
  groupContainer?: string;
  input?: string;
  iconWrapper?: string;
};

export interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputStyles?: React.CSSProperties;
  error?: boolean;
  className?: string;
  enableCopyToClipboard?: boolean;
  enableEllipsisText?: boolean;
  shrinkStart?: number;
  shrinkEnd?: number;
  inputRef?: React.RefObject<HTMLInputElement>;
  errorMessage?: string;
  tooltipLabel?: string;
  classes?: InputClasses;
  customLabel?: React.ReactNode;
  endIcon?: React.ReactElement;
}
