import cn from "classnames";

import "./styles.scss";

import Button from "@/components/Button";
import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";

import YearsList from "../../components/YearsList";
import { PopoverMenuClasses, popoverMenuClasses } from "../constants";

export interface IYearsMenu {
  classes?: PopoverMenuClasses;
  yearsList: number[];
  onSelectYear: (year: number) => void;
  selectedYear: number;
  onIncrementYears: () => void;
  onDecrementYears: () => void;
}

const YearsMenu = (props: IYearsMenu) => {
  const {
    yearsList,
    selectedYear,
    classes,
    onSelectYear,
    onIncrementYears,
    onDecrementYears,
  } = props;

  return (
    <div
      className={cn(popoverMenuClasses.yearContainer, classes?.yearContainer)}
    >
      <div
        className={cn(
          popoverMenuClasses.yearTitleContainer,
          classes?.yearTitleContainer,
        )}
      >
        <div
          className={cn(popoverMenuClasses.yearTitle, classes?.yearTitle)}
        >{`${yearsList[0]}-${yearsList.at(-1)}`}</div>
        <div
          className={cn(
            popoverMenuClasses.yearButtonsContainer,
            classes?.yearButtonsContainer,
          )}
        >
          <Button
            variant="icon"
            startIcon={<ICONS_MAP.ArrowLeftIcon />}
            onClick={onIncrementYears}
            className={cn(popoverMenuClasses.yearButton, classes?.yearButton)}
          />
          <Button
            variant="icon"
            startIcon={<ICONS_MAP.ArrowRightIcon />}
            onClick={onDecrementYears}
            className={cn(popoverMenuClasses.yearButton, classes?.yearButton)}
          />
        </div>
      </div>
      <YearsList
        yearsList={yearsList}
        selectedYear={selectedYear}
        onSelectYear={onSelectYear}
      />
    </div>
  );
};

export default appReactMemo(YearsMenu);
