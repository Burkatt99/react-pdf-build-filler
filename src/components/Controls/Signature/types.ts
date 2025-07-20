export type SignatureFieldClassess = Partial<{
  field: string;
  label: string;
  header: string;
  errorMessage: string;
  clearButton: string;
}>;

export interface ISignatureProps {
  value?: string;
  label?: string;
  disabled?: boolean;
  errorMessage?: string;
  classes?: SignatureFieldClassess;
  handleSignature?: (signature: string) => void;
  handleDeleteSignature?: () => void;
}
