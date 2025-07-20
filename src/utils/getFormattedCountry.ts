export const getFormattedCountry = (
  countryCode?: string,
  locale = "en",
): string => {
  if (!countryCode) {
    return "";
  }
  const formatter = new Intl.DisplayNames([locale], { type: "region" });

  return formatter.of(countryCode) || countryCode;
};
