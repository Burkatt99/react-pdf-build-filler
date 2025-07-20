export const formatterLabel = (label: string) => {
  const formattedString =
    label.charAt(0).toUpperCase() +
    label
      .slice(1)
      .replace(/([A-Z])/g, " $1")
      .toLowerCase();

  return formattedString;
};
