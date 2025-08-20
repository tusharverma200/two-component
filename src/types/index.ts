export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department: string;
  joinDate: string;
  lastLogin: string;
  salary?: number;
}

export interface Column<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  width?: number;
  render?: (value: any, record: T) => React.ReactNode;
  className?: string;
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  className?: string;
  disabled?: (record: T) => boolean;
}

export interface PaginationInfo {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
}

export type SortOrder = 'asc' | 'desc' | null;

export interface SortInfo {
  field: string;
  order: SortOrder;
}

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'outline' | 'filled';

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (value: string) => boolean | string;
}

export interface InputFieldProps {
  id?: string;
  name?: string;
  type?: InputType;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  size?: InputSize;
  variant?: InputVariant;
  disabled?: boolean;
  readonly?: boolean;
  error?: string;
  helperText?: string;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  step?: number;
  min?: number;
  max?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  rules?: ValidationRule[];
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onEnter?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
}