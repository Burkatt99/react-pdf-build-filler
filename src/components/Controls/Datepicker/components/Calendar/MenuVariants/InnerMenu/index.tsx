import { appReactMemo } from "@/hocs/appReactMemo";

import MonthList from "../components/MonthList";
import { IUseDatepickerMenuResult } from "../useDatepickerMenu";

import YearsMenu from "./YearsMenu";

const InnerMenu = (props: IUseDatepickerMenuResult) => {
  const {
    monthList,
    yearsList,
    classes,
    onSelectMonth,
    onSelectYear,
    selectedMonth,
    selectedYear,
    onIncrementYears,
    onDecrementYears,
  } = props;

  return (
    <>
      <MonthList
        monthList={monthList}
        selectedMonth={selectedMonth}
        onSelectMonth={onSelectMonth}
        classes={classes}
      />
      <YearsMenu
        yearsList={yearsList}
        classes={classes}
        selectedYear={selectedYear}
        onSelectYear={onSelectYear}
        onIncrementYears={onIncrementYears}
        onDecrementYears={onDecrementYears}
      />
    </>
  );
};

export default appReactMemo(InnerMenu);
