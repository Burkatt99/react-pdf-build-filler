import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import cn from "classnames";

import "./styles.scss";

import HighlightedText from "@/components/Controls/HighlightedText";
import { KEY_NAMES } from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";

import { MAX_ITEMS, selectClasses } from "../../constants";
import { SelectContext } from "../../SelectContext";
import {
  ISelectOption,
  ISelectProps,
  SelectClasses,
  TSelectTooltipPosition,
  TSelectValue,
} from "../../types";

export interface IOptionsBody {
  handleSelectItem: (item: ISelectOption) => void;
  popoverPosition: TSelectTooltipPosition;
  isOpen: boolean;
  cursor: number;
  initialSelected?: ISelectOption[];
  filteredData: ISelectOption[];
  searchQuery?: string;
  selectedValue: TSelectValue;
  renderOption?: ISelectProps["renderOption"];
  popoverGap: number;
  checkElementPosition?: (node: HTMLDivElement) => void;
  classes?: SelectClasses;
}

const OptionsBody = React.forwardRef<HTMLDivElement, IOptionsBody>(
  (
    {
      handleSelectItem,
      isOpen,
      popoverPosition,
      cursor,
      initialSelected,
      filteredData,
      searchQuery,
      selectedValue,
      renderOption,
      popoverGap,
      checkElementPosition,
      classes,
    },
    ref,
  ) => {
    const {
      loading,
      loadingText = "Loading items...",
      options,
      maxVisibleItems = 5,
      highlightSearch,
      value,
      defaultValue,
      enablePortal,
    } = useContext(SelectContext);

    const estimateItemSize = 150;
    const maxItems = maxVisibleItems > 10 ? 10 : maxVisibleItems;

    const localParentRef = useRef<HTMLDivElement | null>(null);
    const [listHeight, setListHeight] = useState<
      Record<string, number> & { height?: number }
    >({});

    const rowVirtualizer = useVirtualizer({
      count: filteredData.length,
      getScrollElement: () => localParentRef.current,
      estimateSize: () => estimateItemSize,
      overscan: maxItems,
      paddingStart: 0,
      paddingEnd: 0,
    });

    const virtualList = rowVirtualizer.getVirtualItems();

    useEffect(() => {
      if (isOpen && initialSelected && initialSelected[0]) {
        const index = options.findIndex(
          (item) => item.value === initialSelected[0].value,
        );

        rowVirtualizer.scrollToIndex(index, { align: "end" });
      }
    }, [isOpen]);

    useLayoutEffect(() => {
      const itemsLength = filteredData.length || 1;

      if (listHeight[itemsLength] && maxItems < itemsLength) {
        return;
      }

      const lastElementIndex = maxItems < itemsLength ? maxItems : itemsLength;
      const resultIndex = lastElementIndex > MAX_ITEMS ? MAX_ITEMS : maxItems;
      const height = virtualList.slice(0, resultIndex).reduce((prev, item) => {
        return prev + Number(item.size);
      }, 0);

      const resultHeight = height || estimateItemSize;

      setListHeight({
        [itemsLength]: resultHeight,
        height: resultHeight,
      });
    }, [virtualList]);

    const renderOptionContent = useCallback(
      (option: ISelectOption) => {
        const { label, component, isDisabled } = option;
        if (component) {
          if (typeof component === "function") {
            return component(option);
          }
          return component;
        }

        if (highlightSearch && label && !isDisabled) {
          return (
            <HighlightedText searchTerm={searchQuery}>{label}</HighlightedText>
          );
        }

        return label;
      },
      [highlightSearch, searchQuery],
    );

    // tab navigation
    const handleKeyDown = useCallback(
      (option: ISelectOption) => (e: React.KeyboardEvent<HTMLLIElement>) => {
        switch (e.key) {
          case " ":
          case KEY_NAMES.SPACE_BAR:
          case KEY_NAMES.ENTER:
            e.preventDefault();
            e.stopPropagation();
            handleSelectItem(option);
            break;
          default:
            break;
        }
      },
      [handleSelectItem],
    );

    const checkSelection = useCallback(
      (item: ISelectOption) => {
        if (item.isDisabled) {
          return false;
        }
        const isSelectedOption = selectedValue === item.value;
        const defaultSelected = defaultValue === item.value;

        if (value !== undefined) {
          return isSelectedOption;
        }
        if (defaultValue !== undefined && !selectedValue) {
          return defaultSelected;
        }

        return isSelectedOption;
      },
      [filteredData, selectedValue, defaultValue, value, defaultValue],
    );

    const onMountWrapper = useCallback(
      (node: HTMLDivElement) => {
        (ref as React.MutableRefObject<HTMLDivElement>).current = node;
        checkElementPosition?.(node);
      },
      [checkElementPosition, listHeight],
    );

    return (
      <div
        ref={onMountWrapper}
        className={cn(selectClasses.optionsWrapper, classes?.optionsWrapper, {
          [`${selectClasses.optionsWrapper}--portal ${classes?.optionsWrapper}--portal`]:
            enablePortal,
        })}
        style={{
          top:
            popoverPosition === "bottom"
              ? `calc(100% + ${popoverGap}px)`
              : undefined,
          bottom:
            popoverPosition !== "bottom"
              ? `calc(100% + ${popoverGap}px)`
              : undefined,
        }}
      >
        <div
          ref={localParentRef}
          className={cn(selectClasses.optionsContent, classes?.optionsContent)}
          style={{
            maxHeight:
              loading || !listHeight ? "180" : `${listHeight.height}px`,
          }}
        >
          {loading ? (
            <div
              className={cn(selectClasses.loadingBody, classes?.loadingBody)}
            >
              {loadingText}
            </div>
          ) : (
            <ul
              style={{ height: rowVirtualizer.getTotalSize() }}
              role="listbox"
              tabIndex={-1}
              className={cn(selectClasses.options, classes?.options)}
            >
              {virtualList.map(({ index, key, start }) => {
                const currentItem = filteredData[index] || {};
                const { isDisabled } = currentItem;
                const isSelected = checkSelection(currentItem);
                const isHighlighted = index === cursor;

                return (
                  <li
                    key={key}
                    data-index={index}
                    ref={rowVirtualizer.measureElement}
                    onClick={
                      isDisabled
                        ? undefined
                        : () => handleSelectItem(currentItem)
                    }
                    onKeyDown={
                      isDisabled ? undefined : handleKeyDown(currentItem)
                    }
                    data-translate={start}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                    style={{
                      transform: `translateY(${start}px)`,
                    }}
                    className={cn(
                      selectClasses.optionWrapper,
                      classes?.optionWrapper,
                    )}
                  >
                    <>
                      {renderOption ? (
                        renderOption({
                          disabled: !!isDisabled,
                          selected: isSelected,
                          highlighted: isHighlighted,
                          item: currentItem,
                          searchTerm: searchQuery,
                        })
                      ) : (
                        <div
                          className={cn(selectClasses.option, classes?.option, {
                            [`${selectClasses.option}--disabled ${classes?.option}--disabled`]:
                              isDisabled,
                            [`${selectClasses.option}--selected ${classes?.option}--selected`]:
                              isSelected,
                            [`${selectClasses.option}--highlighted ${classes?.option}--highlighted`]:
                              isHighlighted,
                          })}
                        >
                          {renderOptionContent(currentItem)}
                          {isSelected && (
                            <div
                              className={cn(
                                selectClasses.checkIconWrapper,
                                classes?.checkIconWrapper,
                              )}
                            >
                              <ICONS_MAP.CheckIcon />
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className={cn(selectClasses.divider, classes?.divider)}
                      />
                    </>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  },
);

export default appReactMemo(OptionsBody);
