export type CheckboxClasses = Partial<{
  container: string;
  checkIcon: string;
  input: string;
  label: string;
}>;

export interface ICheckboxProps {
  label?: string;
  initialChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  classes?: CheckboxClasses;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}
