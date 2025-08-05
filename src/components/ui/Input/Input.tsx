import React, { forwardRef, useState } from 'react';
import './Input.css';

export type InputVariant = 'default' | 'filled' | 'outline';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  id,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const hasError = Boolean(error);
  
  const wrapperClasses = [
    'input-wrapper',
    `input-wrapper--${variant}`,
    `input-wrapper--${size}`,
    isFocused && 'input-wrapper--focused',
    hasError && 'input-wrapper--error',
    disabled && 'input-wrapper--disabled',
    fullWidth && 'input-wrapper--full-width',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'input-field',
    leftIcon && 'input-field--with-left-icon',
    rightIcon && 'input-field--with-right-icon',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      
      <div className="input-container">
        {leftIcon && (
          <span className="input-icon input-icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {(rightIcon || isLoading) && (
          <span className="input-icon input-icon--right" aria-hidden="true">
            {isLoading ? (
              <svg className="input-spinner" viewBox="0 0 24 24">
                <circle
                  className="input-spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  strokeWidth="3"
                />
              </svg>
            ) : rightIcon}
          </span>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`input-message ${hasError ? 'input-message--error' : 'input-message--helper'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});
