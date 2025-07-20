export const ellipsisText = (
  text: string,
  startSymbols = 5,
  endSymbols = 5,
): string => {
  const start = startSymbols < 0 ? 5 : startSymbols;
  const end = endSymbols < 0 ? 5 : endSymbols;
  if (text.length > 13) {
    return `${text.slice(0, start + 1)}...${text.slice(text.length - end)}`;
  }
  return text;
};

export const inputClasses = {
  container: "Input__container",
  body: "Input__body",
  error: "Input__error",
  label: "Input__label",
  labelTooltip: "Input__label-tooltip",
  tooltipIcon: "Input__tooltip-icon",
  input: "Input__main",
  iconWrapper: "Input__icon-wrapper",
};
