import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import cn from "classnames";

import "./styles.scss";

import { KEY_NAMES } from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";
import { useDataWithFilter } from "@/hooks/useDataWithFilter";
import { useOnclickOutside } from "@/hooks/useOnclickOutside";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { ICONS_MAP } from "@/icons";

import NewTooltip from "../Tooltip";

import OptionsBody, { IOptionsBody } from "./components/OptionsBody";

import { selectClasses } from "./constants";
import { SelectContext } from "./SelectContext";
import {
  ISelectOption,
  ISelectProps,
  TSelectTooltipPosition,
  TSelectValue,
} from "./types";

const Select = (props: ISelectProps) => {
  const {
    selectRef,
    name = `select-${Number(new Date())}`,
    label,
    value,
    defaultValue,
    options,
    inputReadOnly,
    disableCloseOnSelect,
    disabled,
    placeholder,
    open,
    isInitialOpen,
    blurOnSelect,
    onChange,
    onBlur,
    onFocus,
    onOpen,
    onClose,
    error,
    errorMessage,
    inputValue,
    defaultInputValue,
    onInputValueChange,
    loading,
    parentContainerRef,
    required,
    noOptionsText = "No options",
    displayNoOptions,
    selectOnly,
    enablePortal,
    renderOption,
    disableUnselect,
    popoverDirection,
    filterOptions,
    classes,
    customLabel,
    renderCustomButtons,
    isAutoFocused,
    disabledClearFilterByText,
  } = props;
  const [isOpen, setIsOpen] = useState(isInitialOpen ?? !!open);
  const [cursor, setCursor] = useState(-1); // keyboard selected item position (arrow up, arrow down)
  const [selected, setSelected] = useState<TSelectValue>(defaultValue); // for uncontrolled select
  const [popoverPosition, setTooltipPosition] =
    useState<TSelectTooltipPosition>(popoverDirection || "bottom");
  // popover position (changed when scrolling page/parentContainer)
  const parentRef = useRef<HTMLDivElement>(null); // parent wrapper  of list
  const inputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  // to quick get any item by value
  const optionsMap: Map<TSelectValue, ISelectOption> = useMemo(() => {
    const optionsMap = new Map();
    options.forEach((item) => {
      if (!optionsMap.has(item.value)) {
        optionsMap.set(item.value, item);
      }
    });

    return optionsMap;
  }, [options]);

  // if select is uncontrolled get inner state
  const currentValue = value === undefined ? selected : (value as TSelectValue);

  // create an Array from selected values (current selected value)
  const selectedValue = useMemo(() => {
    const hasValue = optionsMap.has(currentValue);
    return hasValue ? currentValue : undefined;
  }, [currentValue, optionsMap]);

  // first selected option for non-multiselect component
  const firstValueOption = useMemo(
    () => options.find((item) => item.value === selectedValue),
    [options, selectedValue],
  );
  // first default selected option for non-multiselect component
  const defaultOption = useMemo(
    () => options.find((item) => item.value === defaultValue),
    [options, defaultValue],
  );

  const initialSelected: ISelectOption[] = useMemo(() => {
    if (!optionsMap.size) {
      return [];
    }
    const values: ISelectOption[] = [];
    const item = optionsMap.get(selectedValue);
    if (item) {
      values.push(item);
    }

    if (value !== undefined) {
      return values;
    }

    if (defaultValue !== undefined && !selectedValue) {
      const defaultSelected: ISelectOption[] = [];
      const item = optionsMap.get(defaultValue);
      if (item) {
        defaultSelected.push(item);
      }

      return defaultSelected;
    }

    return values;
  }, [firstValueOption, defaultOption, selectedValue, optionsMap]);

  const [searchInput, setSearchInput] = useState<string>(
    initialSelected[0]?.label || defaultInputValue || "",
  ); //  for uncontrolled single select input

  const searchInputValue = inputValue ?? searchInput; // custom input value or default inner control

  const {
    data: filteredOptions,
    searchQuery,
    filterByText,
    clearSearch,
  } = useDataWithFilter({
    data: options,
    searchKeys: ["label"],
    filterData: filterOptions,
  }); // debounced search by label

  useUpdateEffect(() => {
    if (!searchInputValue) {
      const label = optionsMap.get(value)?.label;

      if (label) {
        setSearchInput(label);
        setSelected(value);
      }
    }
  }, [optionsMap, value]);

  useUpdateEffect(() => {
    const clearUpInputs = () => {
      setSearchInput("");
      setSelected(undefined);

      if (!disabledClearFilterByText) {
        filterByText("");
      }
    };

    if (value === undefined) {
      clearUpInputs();
    } else {
      const label = optionsMap.get(value)?.label;
      if (label) {
        setSearchInput(label);
        setSelected(value);
      } else if (value === null) {
        clearUpInputs();
      }
    }
  }, [value, optionsMap]);

  // change popover position to opposite when scrolling document/parent container
  const checkElementPosition = useCallback(
    (node?: HTMLDivElement) => {
      const optionsElement = node || parentRef.current;
      if (optionsElement && inputWrapperRef.current) {
        const rect = optionsElement.getBoundingClientRect();
        const inputWrapperRect =
          inputWrapperRef.current.getBoundingClientRect();
        const { bottom: listBottom, top: listTop, height: listHeight } = rect;
        const { bottom: wrapperBottom, height: wrapperHeight } =
          inputWrapperRect;

        const containerRect = parentContainerRef?.getBoundingClientRect();
        const maxBottomPosition =
          containerRect?.bottom || window.innerHeight + window.scrollY;
        const maxTopPosition = containerRect?.top || window.scrollY;

        if (maxBottomPosition > listHeight + wrapperHeight) {
          if (listBottom > maxBottomPosition) {
            setTooltipPosition("top");
          } else if (listTop < maxTopPosition) {
            setTooltipPosition("bottom");
          } else if (wrapperBottom + listHeight + 8 < maxBottomPosition) {
            setTooltipPosition("bottom");
          }
        }
      }
    },
    [parentContainerRef],
  );

  // listen to scroll
  useEffect(() => {
    const parentElement = parentContainerRef || document;

    const onScroll = () => checkElementPosition();

    if (!popoverDirection) {
      parentElement.addEventListener("scroll", onScroll);
    }

    return () => {
      parentElement.removeEventListener("scroll", onScroll);
    };
  }, [parentContainerRef]);

  const clickOutsideHandler = useCallback(() => {
    if (isOpen && !open) {
      setIsOpen(false);
      onClose?.();
      // if we have a selected value we have to clear search after closing to show all options next time
      if (selectedValue) {
        setTimeout(() => clearSearch(), 200);
      }
    }
  }, [isOpen, open, selectedValue]);

  const [_, setWrapperRef] = useOnclickOutside(clickOutsideHandler, {
    // @typescript-eslint/ban-ts-comment @ts-ignore
    ignoreClass: [],
  });

  // scroll to selected item (used when use keyboard)
  const scrollIntoView = useCallback((position: number) => {
    parentRef.current?.scrollTo({
      top: position,
      behavior: "smooth",
    });
  }, []);

  // when search in item, update state and return default item if nothing found
  const filteredData = useMemo(() => {
    setCursor(-1);
    scrollIntoView(0);
    if ((!filteredOptions.length && !loading) || displayNoOptions) {
      return [{ label: noOptionsText, value: null, isDisabled: true }];
    }
    return filteredOptions;
  }, [filteredOptions, noOptionsText, loading, displayNoOptions]);

  // scroll to element when press arrow up/down
  useUpdateEffect(() => {
    if (!parentRef.current) {
      return;
    }
    const list = parentRef.current;
    const [nodeList] = Array.from(list.children);
    const childrenList = list ? Array.from(nodeList.children) : [];
    const child = childrenList[cursor] as HTMLElement | null;
    if (cursor > -1 && filteredData[cursor] && child) {
      scrollIntoView(Number(child.dataset.translate));
    }
  }, [cursor]);

  const openHandler = useCallback(
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (open) {
        return;
      }
      e?.stopPropagation();
      setIsOpen(!isOpen);

      if (isOpen) {
        onClose?.();
        // if we have a selected value we have to clear search after closing to show all options next time
        if (selectedValue) {
          setTimeout(() => clearSearch(), 200);
        }
      } else {
        onOpen?.();
        if (!blurOnSelect) {
          inputRef.current?.focus();
        }
      }
    },
    [
      open,
      isOpen,
      onOpen,
      onClose,
      blurOnSelect,
      enablePortal,
      popoverDirection,
      searchInputValue,
      selectedValue,
    ],
  );

  useUpdateEffect(() => {
    if (isAutoFocused) {
      openHandler();
    }
  }, [isAutoFocused]);

  const itemSelectionHandler = useCallback(
    (item: ISelectOption) => {
      const itemIsSelected = selectedValue === item.value;

      onInputValueChange?.("");
      setSearchInput(itemIsSelected ? "" : (item.label as string));
      setTimeout(() => clearSearch(), 200);

      const singleValue = itemIsSelected
        ? undefined
        : (item.value as TSelectValue);

      onChange?.(singleValue, item);
      setSelected(singleValue);
    },
    [selectedValue, searchInputValue, onChange, disableUnselect],
  );

  const handleSelectItem = useCallback(
    (item: ISelectOption) => {
      itemSelectionHandler(item);

      if (!blurOnSelect) {
        inputRef.current?.focus();
      }
      if (!disableCloseOnSelect && !open) {
        setIsOpen(false);
        onClose?.();
        // if we have a selected value we have to clear search after closing to show all options next time
        setTimeout(() => clearSearch(), 200);
      }
    },
    [itemSelectionHandler, open, onClose, blurOnSelect],
  );

  const onInputSearch = (text: string, event?: React.SyntheticEvent) => {
    const trimmedValue = text.trim();

    if (selectedValue) {
      onChange?.(undefined);
      setSelected(undefined);
    }

    onInputValueChange?.(text, event);
    setSearchInput(text);
    filterByText(trimmedValue);
  };

  const onSearchItem = (e: any) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    const { value } = e.target;
    onInputSearch(value, e);
  };

  // keyboard navigate on input click
  const keyboardNavigate = useCallback(
    (e: any) => {
      if (inputReadOnly) {
        return;
      }

      switch (e.key) {
        case KEY_NAMES.ARROW_DOWN:
          e.preventDefault();
          if (isOpen) {
            setCursor((cursor) =>
              cursor < filteredData.length - 1 ? cursor + 1 : 0,
            );
          } else {
            setIsOpen(true);
            onOpen?.();
          }
          break;
        case KEY_NAMES.ARROW_UP:
          e.preventDefault();
          setCursor((cursor) =>
            cursor > 0 ? cursor - 1 : filteredData.length - 1,
          );
          break;
        case KEY_NAMES.ESCAPE:
          if (!open) {
            setIsOpen(false);
            onClose?.();
          }
          break;
        case KEY_NAMES.ENTER:
          e.preventDefault();
          if (isOpen && filteredData[cursor]) {
            handleSelectItem(filteredData[cursor]);
            if (!open && !disableCloseOnSelect) {
              setIsOpen(false);
              onClose?.();
              setCursor(-1);
            }
          }
          break;
        default:
          return "";
      }
    },
    [
      cursor,
      isOpen,
      filteredData,
      inputReadOnly,
      open,
      handleSelectItem,
      disableCloseOnSelect,
    ],
  );

  useEffect(() => {
    // if there is no input to listen keys => add event listener if select is open
    if (isOpen && firstValueOption?.component) {
      document.addEventListener("keydown", keyboardNavigate);
      return () => document.removeEventListener("keydown", keyboardNavigate);
    }
  }, [isOpen, keyboardNavigate, firstValueOption]);

  const onBlurInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      if (value === null) {
        const label = optionsMap.get(value)?.label;
        if (label) {
          setSearchInput(label);
        }
      }
      onBlur?.(e);
    },
    [value, onBlur, optionsMap],
  );

  const renderSelectElement = () => {
    const baseInputProps = {
      ref: inputRef,
      id: name,
      name,
      value: searchInputValue,
      onChange: onSearchItem,
      onKeyDown: keyboardNavigate,
      placeholder: placeholder,
      readOnly: loading || inputReadOnly || selectOnly,
      disabled,
      onBlur: onBlurInput,
      onFocus,
      autoComplete: "off",
      autoFocus: isOpen,
    };
    const firstSelected = initialSelected[0];

    if (firstSelected?.component) {
      let customComponent = firstSelected.component as ReactNode;
      if (typeof firstSelected.component === "function") {
        customComponent = firstSelected.component(firstSelected) as ReactNode;
      }

      return (
        <div
          className={cn(
            selectClasses.customOptionWrapper,
            classes?.customOptionWrapper,
          )}
        >
          {customComponent}
        </div>
      );
    }

    return (
      <>
        <input
          {...baseInputProps}
          className={cn(selectClasses.input, classes?.input, {
            [`${selectClasses.input}--readOnly ${classes?.input}--readOnly`]:
              inputReadOnly,
            [`${selectClasses.input}--open ${classes?.input} `]: isOpen,
          })}
        />
      </>
    );
  };

  const renderInput = () => {
    return (
      <div
        ref={inputWrapperRef}
        data-is-focused={isOpen}
        onClick={disabled ? undefined : openHandler}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(selectClasses.inputWrapper, classes?.inputWrapper, {
          [`${selectClasses.inputWrapper}--disabled ${classes?.inputWrapper}--disabled`]:
            disabled,
          [`${selectClasses.inputWrapper}--error ${classes?.inputWrapper}--error`]:
            error,
          [`${selectClasses.inputWrapper}--loading ${classes?.inputWrapper}--loading`]:
            loading,
          [`${selectClasses.inputWrapper}--selected ${classes?.inputWrapper}--selected`]:
            !!firstValueOption?.component,
        })}
      >
        {renderSelectElement()}
        {renderCustomButtons?.()}

        <div
          onClick={disabled ? undefined : openHandler}
          role="button"
          tabIndex={0}
          className={cn(selectClasses.arrowWrapper, classes?.arrowWrapper, {
            [`${selectClasses.arrowWrapper}--disabled ${classes?.arrowWrapper}--disabled`]:
              disabled,
          })}
        >
          <div
            className={cn(selectClasses.flipContainer, classes?.flipContainer, {
              [`${selectClasses.flipContainer}--open ${classes?.flipContainer}--open`]:
                isOpen,
            })}
          >
            <ICONS_MAP.ChevronDownIcon />
          </div>
        </div>
      </div>
    );
  };

  const renderSelect = () => {
    const defaultOptionsProps = {
      ref: parentRef,
      handleSelectItem,
      popoverPosition,
      isOpen,
      cursor,
      initialSelected,
      filteredData,
      searchQuery,
      selectedValue,
      default: defaultValue,
      renderOption,
      checkElementPosition: popoverDirection ? undefined : checkElementPosition,
      popoverGap: 0,
      classes,
    } as IOptionsBody;

    if (enablePortal && !disabled) {
      return (
        <NewTooltip
          defaultPlacement={popoverPosition}
          content={<OptionsBody {...defaultOptionsProps} />}
          open={isOpen}
        >
          <div>{renderInput()}</div>
        </NewTooltip>
      );
    }

    return (
      <div className={cn(selectClasses.dropdown, classes?.dropdown)}>
        {renderInput()}
        {isOpen && <OptionsBody {...defaultOptionsProps} />}
      </div>
    );
  };

  const renderLabel = () => {
    if (customLabel) {
      return customLabel;
    }

    if (label) {
      return (
        <div>
          <label
            htmlFor={name}
            className={cn(selectClasses.label, classes?.label, {
              [`${selectClasses.label}--disabled ${classes?.label}--disabled`]:
                disabled,
              [`${selectClasses.label}--required ${classes?.label}--required`]:
                required,
            })}
          >
            {label}
          </label>
        </div>
      );
    }
  };

  return (
    <div
      ref={setWrapperRef}
      className={cn(selectClasses.container, classes?.container)}
    >
      <div ref={selectRef} className={cn(selectClasses.root, classes?.root)}>
        {renderLabel()}
        <SelectContext.Provider value={props}>
          {renderSelect()}
        </SelectContext.Provider>
      </div>
      <div className={cn(selectClasses.error, classes?.error)}>
        {error && errorMessage}
      </div>
    </div>
  );
};

export default appReactMemo(Select);
