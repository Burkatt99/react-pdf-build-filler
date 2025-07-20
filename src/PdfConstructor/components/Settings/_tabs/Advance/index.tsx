import FormCheckbox from "@/components/Form/FormCheckbox";
import FormInput from "@/components/Form/FormInput";
import FormSelect from "@/components/Form/FormSelect";
import { ComponentClasses, TCustomComponents } from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";

import useAdvanceTab from "../../hooks/useAdvanceTab";

interface IAdvanceProps {
  className: string;
  componentClasses?: ComponentClasses;
  customComponents?: TCustomComponents;
}

const Advance = (props: IAdvanceProps) => {
  const { className, componentClasses, customComponents } = props;
  const { showCellFormat, showLengthFields, getConditionOptions } =
    useAdvanceTab();

  return (
    <div className={className}>
      {showCellFormat && (
        <FormCheckbox
          label="Cell format"
          name="isCellFormat"
          classes={componentClasses?.checkbox}
          customComponent={customComponents?.checkbox}
        />
      )}
      {showLengthFields && (
        <>
          <FormInput
            name="minLength"
            type="number"
            label="Min value"
            tooltipLabel="Min value"
            classes={componentClasses?.input}
            customComponent={customComponents?.input}
          />
          <FormInput
            name="maxLength"
            type="number"
            label="Max value"
            tooltipLabel="Max value"
            classes={componentClasses?.input}
            customComponent={customComponents?.input}
          />
        </>
      )}
      <FormSelect
        name="condition"
        label="Condition"
        classes={componentClasses?.select}
        options={getConditionOptions()}
        customComponent={customComponents?.select}
      />
    </div>
  );
};

export default appReactMemo(Advance);
