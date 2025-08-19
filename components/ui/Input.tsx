"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div style={{ marginBottom: "1rem" }}>
        {label && (
          <label 
            htmlFor={props.id} 
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#374151",
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            border: `1px solid ${error ? "#ef4444" : isFocused ? "#2563eb" : "#d1d5db"}`,
            fontSize: "1rem",
            transition: "all 0.2s ease",
            outline: "none",
            boxShadow: isFocused && !error ? "0 0 0 3px rgba(37, 99, 235, 0.1)" : "none",
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {error && (
          <p style={{
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: "#ef4444",
          }}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p style={{
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: "#6b7280",
          }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
