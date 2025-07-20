import cn from "classnames";

import "./styles.scss";

import Button from "@/components/Button";
import { appReactMemo } from "@/hocs/appReactMemo";

import { useDatePickerContext } from "../../datepickerContext";

import { ControlButtonsClasses, controlButtonsClasses } from "./constants";

type ControlButtonsProps = {
  classes?: ControlButtonsClasses;
};

const ControlButtons = ({ classes }: ControlButtonsProps) => {
  const { onCancelDate, onApplyDate, state } = useDatePickerContext();

  const getDisabled = () => {
    return !state.startDate;
  };

  return (
    <div className={cn(controlButtonsClasses.container, classes?.container)}>
      <Button
        variant="outline"
        onClick={onCancelDate}
        className={cn(
          controlButtonsClasses.cancelButton,
          classes?.cancelButton,
        )}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={onApplyDate}
        disabled={getDisabled()}
        className={cn(controlButtonsClasses.applyButton, classes?.applyButton)}
      >
        Apply
      </Button>
    </div>
  );
};

export default appReactMemo(ControlButtons);
