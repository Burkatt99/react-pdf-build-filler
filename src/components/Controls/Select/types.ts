import React from "react";

export type TSelectValue = string | number | boolean | null | undefined;

export interface ISelectOption<T = Record<string, unknown>> {
  value: TSelectValue;
  label?: string;
  isDisabled?: boolean;
  component?: ((option: ISelectOption<T>) => React.ReactNode) | React.ReactNode;
  customProps?: T;
}

export type TSelectTooltipPosition = "top" | "bottom";

export interface IRenderOptionProps<T = Record<string, unknown>> {
  disabled: boolean;
  selected: boolean;
  highlighted: boolean;
  item: ISelectOption<T>;
  searchTerm?: string;
}

export interface ISelectRenderButtonProps {
  isOpen: boolean;
  tabIndex: number;
  loading?: boolean;
  readonly?: boolean;
  disabled?: boolean;
}

export interface IRenderHiddenSelectedOptions<T = Record<string, unknown>> {
  options: ISelectOption<T>[];
  removeOption: (item: ISelectOption<T>) => void;
}

export type IRenderOption = <T extends Record<string, unknown>>(
  props: IRenderOptionProps<T>,
) => React.ReactElement;

export type SelectClasses = Partial<{
  container: string;
  root: string;
  label: string;
  error: string;
  optionsWrapper: string;
  optionsContent: string;
  loadingBody: string;
  options: string;
  optionWrapper: string;
  option: string;
  flipContainer: string;
  checkIconWrapper: string;
  selectedIcon: string;
  divider: string;
  inputWrapper: string;
  arrowWrapper: string;
  arrowButton: string;
  selectedElements: string;
  selectedItemTag: string;
  selectedItemText: string;
  removeTagButton: string;
  selectedItem: string;
  counterItem: string;
  counterTag: string;
  input: string;
  dropdown: string;
  placeholder: string;
  customOptionWrapper: string;
  removeAllButton: string;
}>;
export interface ISelectProps {
  name?: string;
  label?: string;
  className?: string;
  value?: TSelectValue;
  defaultValue?: TSelectValue; // Use when the component is not controlled.
  options: ISelectOption[];
  inputReadOnly?: boolean;
  blurOnSelect?: boolean;
  disableCloseOnSelect?: boolean; // If true, the popup won't close when a value is selected.
  disabled?: boolean;
  placeholder?: string;
  loader?: React.ReactNode;
  hideArrow?: boolean;
  open?: boolean;
  isInitialOpen?: boolean;
  onChange?: (value: TSelectValue, option?: ISelectOption) => void;
  onBlur?: <T>(e?: React.FocusEvent<T>) => void;
  onFocus?: <T>(e?: React.FocusEvent<T>) => void;
  onOpen?: () => void;
  onClose?: () => void;
  error?: boolean;
  errorMessage?: string;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (text: string, event?: React.SyntheticEvent) => void;
  loading?: boolean;
  maxVisibleItems?: number;
  highlightSearch?: boolean;
  parentContainerRef?: HTMLDivElement | null;
  required?: boolean;
  noOptionsText?: string;
  displayNoOptions?: boolean;
  loadingText?: string;
  selectOnly?: boolean;
  selectedIcon?: React.ReactElement;
  enablePortal?: boolean;
  renderOption?: IRenderOption;
  disableUnselect?: boolean;
  isAnimatedLabel?: boolean;
  popoverDirection?: "top" | "bottom";
  filterOptions?: (options: ISelectOption[], query: string) => ISelectOption[];
  classes?: SelectClasses;
  customLabel?: React.ReactNode;
  renderCustomButtons?: () => React.ReactNode;
  isAutoFocused?: boolean;
  selectRef?: React.Ref<HTMLDivElement>;
  disabledClearFilterByText?: boolean;
}
