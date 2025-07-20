import cn from "classnames";

import { appReactMemo } from "@/hocs/appReactMemo";

import {
  PopoverMenuClasses,
  popoverMenuClasses,
} from "../../PopoverMenu/constants";
import MenuButton from "../MenuButton";

type YearsListProps = {
  yearsList: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
  classes?: PopoverMenuClasses;
};

const YearsList = ({
  yearsList,
  selectedYear,
  classes,
  onSelectYear,
}: YearsListProps) => {
  return (
    <div
      className={cn(popoverMenuClasses.listContainer, classes?.listContainer)}
    >
      {yearsList.map((item) => (
        <MenuButton
          key={item}
          onClick={onSelectYear}
          isSelected={item === selectedYear}
          number={item}
        >
          <div className={cn(popoverMenuClasses.listLabel, classes?.listLabel)}>
            {item}
          </div>
        </MenuButton>
      ))}
    </div>
  );
};

export default appReactMemo(YearsList);
