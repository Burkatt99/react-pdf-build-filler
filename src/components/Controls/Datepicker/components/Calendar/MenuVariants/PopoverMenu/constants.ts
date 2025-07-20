import { TooltipClasses } from "@/components/Controls/Tooltip/types";

export const popoverMenuClasses = {
  tooltip: "PopoverMenu__tooltip",
  openButton: "PopoverMenu__open-button",
  container: "PopoverMenu__container",
  monthContainer: "PopoverMenu__month-container",
  monthTitle: "PopoverMenu__month-title",
  monthTitleContainer: "PopoverMenu__month-title-container",
  yearContainer: "PopoverMenu__year-container",
  yearTitle: "PopoverMenu__year-title",
  yearTitleContainer: "PopoverMenu__year-title-container",
  yearButtonsContainer: "PopoverMenu__year-buttons-container",
  yearButton: "PopoverMenu__year-button",
  listContainer: "PopoverMenu__list-container",
  button: "PopoverMenu__button",
  listLabel: "PopoverMenu__list-label",
  yearsMenu: "PopoverMenu__years-menu",
  yearsMenuTitle: "PopoverMenu__years-menu-title",
};

export type PopoverMenuClasses = Partial<{
  tooltip: TooltipClasses;
  openButton: string;
  container: string;
  monthContainer: string;
  monthTitle: string;
  monthTitleContainer: string;
  yearContainer: string;
  yearTitle: string;
  yearTitleContainer: string;
  yearButtonsContainer: string;
  yearButton: string;
  listContainer: string;
  button: string;
  listLabel: string;
  yearsMenu: string;
  yearsMenuTitle: string;
}>;
