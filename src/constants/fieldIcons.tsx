import { ICONS_MAP } from "@/icons";

export const lisfOfImageTypes: Record<string, React.ReactElement> = {
  text: <ICONS_MAP.TextFieldIcon />,
  number: <ICONS_MAP.NumberFieldIcon />,
  date: <ICONS_MAP.CalendarMonthIcon />,
  partlyDate: <ICONS_MAP.CalendarIcon />,
  signature: <ICONS_MAP.SignatureIcon />,
  image: <ICONS_MAP.ImageFieldIcon />,
  checkbox: <ICONS_MAP.CheckboxFieldIcon />,
  radio: <ICONS_MAP.RadiobuttonFieldIcon />,
  country: <ICONS_MAP.FlagIcon />,
  dropdown: <ICONS_MAP.DropdownIcon />,
};

export const bigIcons = ["image", "number", "checkbox", "partlyDate"];
