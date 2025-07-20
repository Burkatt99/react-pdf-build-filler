import { useCallback, useEffect, useMemo, useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

import { partOfDateList } from "@/constants/base";
import { ISortOption } from "@/constants/types";
import { usePdfConstructor } from "@/context";

type UseBaseTabProps = {
  handleSetOptions: (sortOptions: ISortOption[]) => void;
};

type UseBaseTabType = {
  isNotSignature: boolean;
  isRadio: boolean;
  isPartlyDate: boolean;
  isDropdown: boolean;
  optionValues: { label: string; value: string }[];
  optionNumList: number[];
  isSorting: boolean;
  isEditing: Record<string, number | boolean>;
  inputValue: string;
  sortOptions: ISortOption[];
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setEditingValue: React.Dispatch<React.SetStateAction<string>>;
  handleChangeSorting: (newList: UniqueIdentifier[]) => void;
  handleRemoveOption: (id: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleEditOption: (id: number) => void;
  handleAddOption: () => void;
  setIsEditing: React.Dispatch<
    React.SetStateAction<Record<string, number | boolean>>
  >;
  setIsSorting: React.Dispatch<React.SetStateAction<boolean>>;
};

const useBaseTab = ({ handleSetOptions }: UseBaseTabProps): UseBaseTabType => {
  const { selectedField: selected } = usePdfConstructor();
  const [inputValue, setInputValue] = useState<string>("");
  const [optionNumList, setOptionNumList] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState<ISortOption[]>([]);
  const [isEditing, setIsEditing] = useState<Record<string, number | boolean>>(
    {},
  );
  const [editingValue, setEditingValue] = useState<string>("");

  const isNotSignature = selected?.type !== "signature";
  const isRadio = selected?.type === "radio";
  const isPartlyDate = selected?.type === "partlyDate";
  const isDropdown = selected?.type === "dropdown";

  const optionValues = useMemo(
    () =>
      partOfDateList.map(({ label, value }) => ({
        label,
        value,
      })),
    [partOfDateList],
  );

  useEffect(() => {
    setSortOptions([]);

    if (selected?.sortOptions) {
      setSortOptions(selected.sortOptions);
    }
  }, [selected]);

  useEffect(() => {
    setOptionNumList(sortOptions.map((_, index) => index + 1) || []);
  }, [sortOptions, selected]);

  const handleAddOption = useCallback(() => {
    if (inputValue.trim() !== "") {
      setSortOptions((prev) => [
        ...prev,
        {
          label: inputValue.trim(),
          value: inputValue.trim(),
        },
      ]);

      setInputValue("");
    }
  }, [inputValue, setSortOptions]);

  const handleChangeSorting = useCallback(
    (newList: UniqueIdentifier[]) => {
      const sortedOptions = (newList as number[])
        .map((num) => sortOptions[num - 1])
        .filter(Boolean);

      setOptionNumList(newList as number[]);
      setSortOptions(sortedOptions);
      setIsSorting(false);
    },
    [setOptionNumList, setSortOptions, sortOptions, setIsSorting],
  );

  const handleRemoveOption = useCallback(
    (id: number) => {
      const newOptions = sortOptions.filter((_, index) => index + 1 !== id);
      setSortOptions(newOptions);
    },
    [sortOptions, setSortOptions],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && inputValue.trim()) {
        handleAddOption();
      }
    },
    [inputValue, handleAddOption],
  );

  const handleEditOption = useCallback(
    (id: number) => {
      setSortOptions((prev) =>
        prev.map((option, index) =>
          index + 1 === id
            ? {
                value: editingValue,
                label: editingValue,
              }
            : option,
        ),
      );

      setIsEditing({});
    },
    [editingValue],
  );

  useEffect(() => {
    handleSetOptions(sortOptions);
  }, [sortOptions, handleSetOptions]);

  return {
    isNotSignature,
    isRadio,
    isPartlyDate,
    optionValues,
    isDropdown,
    optionNumList,
    isEditing,
    isSorting,
    inputValue,
    sortOptions,
    setInputValue,
    setEditingValue,
    handleChangeSorting,
    handleEditOption,
    handleKeyDown,
    handleRemoveOption,
    handleAddOption,
    setIsEditing,
    setIsSorting,
  };
};

export default useBaseTab;
