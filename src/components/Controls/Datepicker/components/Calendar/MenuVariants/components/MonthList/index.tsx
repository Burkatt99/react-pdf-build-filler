import cn from "classnames";

import "../styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";

import { IMonthsList } from "../../../../../helpers/utils";
import {
  PopoverMenuClasses,
  popoverMenuClasses,
} from "../../PopoverMenu/constants";
import MenuButton from "../MenuButton";

export interface IMonthMenu {
  monthList: IMonthsList[];
  onSelectMonth: (month: number) => void;
  selectedMonth: number;
  classes?: PopoverMenuClasses;
}

const MonthList = (props: IMonthMenu) => {
  const { monthList, selectedMonth, classes, onSelectMonth } = props;

  return (
    <div
      className={cn(popoverMenuClasses.listContainer, classes?.listContainer)}
    >
      {monthList.map((item) => (
        <MenuButton
          key={item.monthNumber}
          onClick={onSelectMonth}
          isSelected={item.monthNumber === selectedMonth}
          number={item.monthNumber}
          className={cn(popoverMenuClasses.button, classes?.button)}
        >
          <div className={cn(popoverMenuClasses.listLabel, classes?.listLabel)}>
            {item.monthLabel}
          </div>
        </MenuButton>
      ))}
    </div>
  );
};

export default appReactMemo(MonthList);
