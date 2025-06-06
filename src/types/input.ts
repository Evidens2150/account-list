export type InputType = 'text' | 'password';

export interface IInputProps {
  type?: InputType;
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
}