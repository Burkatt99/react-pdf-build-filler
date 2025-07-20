import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";

import { IMonthsList } from "../../../../../helpers/utils";
import MonthList from "../../components/MonthList";
import { PopoverMenuClasses, popoverMenuClasses } from "../constants";

export interface IMonthMenu {
  monthList: IMonthsList[];
  onSelectMonth: (month: number) => void;
  selectedMonth: number;
  classes?: PopoverMenuClasses;
}

const MonthMenu = (props: IMonthMenu) => {
  const { monthList, selectedMonth, classes, onSelectMonth } = props;

  return (
    <div
      className={cn(popoverMenuClasses.monthContainer, classes?.monthContainer)}
    >
      <div
        className={cn(
          popoverMenuClasses.monthTitleContainer,
          classes?.monthTitleContainer,
        )}
      >
        <div className={cn(popoverMenuClasses.monthTitle, classes?.monthTitle)}>
          {monthList[selectedMonth].monthLabel}
        </div>
      </div>
      <MonthList
        monthList={monthList}
        selectedMonth={selectedMonth}
        onSelectMonth={onSelectMonth}
      />
    </div>
  );
};

export default appReactMemo(MonthMenu);
