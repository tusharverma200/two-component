import React, { useState, useCallback, useRef, useEffect, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { InputFieldProps } from '../../types';
import './InputField.css';

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  defaultValue,
  size = 'md',
  variant = 'default',
  disabled = false,
  readonly = false,
  error,
  helperText,
  required = false,
  autoFocus = false,
  autoComplete,
  maxLength,
  minLength,
  step,
  min,
  max,
  prefix,
  suffix,
  className = '',
  style,
  rules = [],
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onEnter,
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;
  const isControlled = value !== undefined;

  // Validation logic
  const validateValue = useCallback((val: string): string => {
    if (!touched && !val) return '';
    
    for (const rule of rules) {
      if (rule.required && !val.trim()) {
        return rule.message || `${label || 'This field'} is required`;
      }
      
      if (rule.min && val.length < rule.min) {
        return rule.message || `Must be at least ${rule.min} characters`;
      }
      
      if (rule.max && val.length > rule.max) {
        return rule.message || `Must be no more than ${rule.max} characters`;
      }
      
      if (rule.pattern && !rule.pattern.test(val)) {
        return rule.message || 'Invalid format';
      }
      
      if (rule.validator) {
        const result = rule.validator(val);
        if (typeof result === 'string') return result;
        if (!result) return rule.message || 'Invalid value';
      }
    }
    
    return '';
  }, [rules, label, touched]);

  // Update internal error when value changes
  useEffect(() => {
    if (touched) {
      const validationError = validateValue(currentValue);
      setInternalError(validationError);
    }
  }, [currentValue, validateValue, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    if (touched) {
      const validationError = validateValue(newValue);
      setInternalError(validationError);
    }
    
    onChange?.(newValue, e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setTouched(true);
    
    const validationError = validateValue(currentValue);
    setInternalError(validationError);
    
    onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter(currentValue, e);
    }
    onKeyDown?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine input type
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  // Determine if there's an error to show
  const displayError = error || internalError;
  const hasError = Boolean(displayError);
  
  // Determine if input is valid (for success state)
  const isValid = touched && !hasError && currentValue.trim() !== '';

  // Build CSS classes
  const containerClasses = [
    'input-field',
    `input-field--${size}`,
    `input-field--${variant}`,
    isFocused && 'input-field--focused',
    hasError && 'input-field--error',
    isValid && 'input-field--valid',
    disabled && 'input-field--disabled',
    readonly && 'input-field--readonly',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'input-field__input',
    prefix && 'input-field__input--with-prefix',
    (suffix || type === 'password') && 'input-field__input--with-suffix'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={style}>
      {label && (
        <label htmlFor={inputId} className="input-field__label">
          {label}
          {required && <span className="input-field__required" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="input-field__wrapper">
        {prefix && (
          <div className="input-field__prefix">
            {prefix}
          </div>
        )}
        
        <input
          ref={ref || inputRef}
          id={inputId}
          name={name}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          value={currentValue}
          disabled={disabled}
          readOnly={readonly}
          required={required}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          step={step}
          min={min}
          max={max}
          aria-invalid={hasError}
          aria-describedby={
            [
              displayError && `${inputId}-error`,
              helperText && `${inputId}-helper`
            ].filter(Boolean).join(' ') || undefined
          }
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        
        <div className="input-field__suffix">
          {type === 'password' && (
            <button
              type="button"
              className="input-field__toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          
          {suffix && <div className="input-field__suffix-content">{suffix}</div>}
          
          {hasError && (
            <div className="input-field__error-icon">
              <AlertCircle size={16} />
            </div>
          )}
          
          {isValid && (
            <div className="input-field__success-icon">
              <CheckCircle size={16} />
            </div>
          )}
        </div>
      </div>
      
      {displayError && (
        <div
          id={`${inputId}-error`}
          className="input-field__error-message"
          role="alert"
          aria-live="polite"
        >
          {displayError}
        </div>
      )}
      
      {helperText && !displayError && (
        <div
          id={`${inputId}-helper`}
          className="input-field__helper-text"
        >
          {helperText}
        </div>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;