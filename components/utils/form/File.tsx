import React from "react";

export interface InputProps {
  label: string;
  setValue: (value: any) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  accept?: string;
  children?: React.ReactNode;
}

// TODO: Style this component
export default function File({
  label,
  setValue,
  className,
  placeholder,
  required,
  disabled,
  readOnly,
  autoFocus,
  accept,
  children,
}: InputProps) {
  return (
    <div className={`form-wrapper label-input ${className}`}>
      <label htmlFor={label}>{label}</label>
      <input
        className="input"
        type="file"
        id={label}
        onChange={(e) => setValue(e.target.files && e.target.files[0])}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        accept={accept}
      />
      {children}
    </div>
  );
}
