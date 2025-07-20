import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import cn from "classnames";

import Button from "@/components/Button";
import Input from "@/components/Controls/Input";
import FormCheckbox from "@/components/Form/FormCheckbox";
import FormInput from "@/components/Form/FormInput";
import FormSelect from "@/components/Form/FormSelect";
import SortableList from "@/components/SortableList";
import { SortableItem } from "@/components/SortableList/components/SortableItem";
import {
  ComponentClasses,
  ISortOption,
  TCustomComponents,
} from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";
import { baseTabClasses } from "@/PdfConstructor/constants";
import { BaseTabClasses } from "@/PdfConstructor/types";

import useBaseTab from "../../hooks/useBaseTab";

interface IBaseProps {
  classes?: BaseTabClasses;
  requiredDisable: boolean;
  componentClasses?: ComponentClasses;
  customComponents?: TCustomComponents;
  handleSetOptions: (sortOptions: ISortOption[]) => void;
}

const Base = (props: IBaseProps) => {
  const {
    requiredDisable,
    classes,
    componentClasses,
    customComponents,
    handleSetOptions,
  } = props;

  const {
    isRadio,
    isPartlyDate,
    isDropdown,
    optionValues,
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
  } = useBaseTab({
    handleSetOptions,
  });

  return (
    <div className={cn(baseTabClasses.tabContent, classes?.tabContent)}>
      <FormCheckbox
        name="isRequired"
        disabled={requiredDisable}
        label="Required field"
        classes={componentClasses?.checkbox}
        customComponent={customComponents?.checkbox}
      />
      <FormInput
        name="fieldName"
        label="Field name"
        tooltipLabel="Key of field which will be used in the form"
        classes={componentClasses?.input}
        customComponent={customComponents?.input}
      />
      <FormInput
        name="label"
        label="Label"
        tooltipLabel="Main text which will show for field"
        classes={componentClasses?.input}
        customComponent={customComponents?.input}
      />

      {isRadio && (
        <>
          <FormInput
            name="optionValue"
            label="Option value"
            tooltipLabel="Key of the option"
            classes={componentClasses?.input}
            customComponent={customComponents?.input}
          />
          <FormInput
            name="optionLabel"
            label="Option label"
            tooltipLabel="Label of the option which will show in the select"
            classes={componentClasses?.input}
            customComponent={customComponents?.input}
          />
        </>
      )}
      {isPartlyDate && (
        <>
          <FormSelect
            name="optionValue"
            label="Part of date"
            options={optionValues}
            classes={componentClasses?.select}
            customComponent={customComponents?.select}
          />
          <FormInput
            name="optionLabel"
            label="Part of field date name"
            tooltipLabel="Key of the part of the date field"
            classes={componentClasses?.input}
            customComponent={customComponents?.input}
          />
        </>
      )}
      {isDropdown && (
        <div className={cn(baseTabClasses.dropdown, classes?.dropdown)}>
          <div className={cn(baseTabClasses.addOption, classes?.addOption)}>
            <Input
              name="dropdownItem"
              value={inputValue}
              label="Dropdown item"
              tooltipLabel="Key of the option"
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              classes={{
                container: `${baseTabClasses.dropdownInput} ${classes?.dropdownInput}`,
                ...componentClasses?.input,
              }}
            />
            <Button
              variant="outline"
              startIcon={<ICONS_MAP.AddIcon />}
              onClick={handleAddOption}
            />
          </div>

          {!!optionNumList.length && (
            <SortableList
              list={optionNumList}
              onSort={handleChangeSorting}
              modifiers={[
                restrictToVerticalAxis,
                restrictToFirstScrollableAncestor,
              ]}
              strategy={verticalListSortingStrategy}
            >
              <div
                className={cn(baseTabClasses.sortContent, classes?.sortContent)}
              >
                <div className={cn(baseTabClasses.sortList, classes?.sortList)}>
                  {optionNumList.map((id) => {
                    const sortingOption = sortOptions.find(
                      (_, index) => index + 1 === id,
                    );
                    const isEditingItem =
                      isEditing.id === id && isEditing.value;

                    return (
                      <div style={{ position: "relative" }} key={id}>
                        <SortableItem id={id} onDragging={setIsSorting}>
                          <div
                            className={
                              (baseTabClasses.sortItem, classes?.sortItem)
                            }
                          >
                            <ICONS_MAP.DragIcon />
                            {!isEditingItem && sortingOption?.label}
                          </div>
                        </SortableItem>
                        <div
                          className={cn(
                            baseTabClasses.itemButtons,
                            classes?.itemButtons,
                          )}
                        >
                          {isEditingItem ? (
                            <>
                              <Input
                                name="item"
                                width="100px"
                                defaultValue={sortingOption?.label}
                                onChange={(e) =>
                                  setEditingValue(e.target.value)
                                }
                                classes={{
                                  input: `${baseTabClasses.itemInput} ${classes?.itemInput}`,
                                }}
                              />
                              <Button
                                variant="icon"
                                size="small"
                                className={cn(
                                  baseTabClasses.optionButton,
                                  classes?.optionButton,
                                )}
                                startIcon={<ICONS_MAP.CheckIcon />}
                                onClick={() => handleEditOption(id)}
                              />
                            </>
                          ) : (
                            <>
                              <Button
                                variant="icon"
                                size="small"
                                className={cn(
                                  baseTabClasses.optionButton,
                                  classes?.optionButton,
                                )}
                                style={{
                                  visibility: isSorting ? "hidden" : "visible",
                                }}
                                startIcon={<ICONS_MAP.EditIcon />}
                                onClick={() =>
                                  setIsEditing({
                                    id,
                                    value: true,
                                  })
                                }
                              />
                              <Button
                                variant="icon"
                                size="small"
                                startIcon={<ICONS_MAP.DeleteIcon />}
                                onClick={() => handleRemoveOption(id)}
                                className={cn(
                                  baseTabClasses.optionButton,
                                  classes?.optionButton,
                                )}
                                style={{
                                  visibility: isSorting ? "hidden" : "visible",
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SortableList>
          )}
        </div>
      )}
    </div>
  );
};

export default appReactMemo(Base);
