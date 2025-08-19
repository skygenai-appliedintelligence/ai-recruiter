"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

export default function Button({ 
  variant = "primary", 
  size = "md", 
  loading = false, 
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    borderRadius: 8,
    border: "none",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    fontSize: size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem",
    padding: size === "sm" ? "0.5rem 0.75rem" : size === "lg" ? "0.875rem 1.5rem" : "0.75rem 1rem",
  };

  const variantStyles = {
    primary: {
      background: "#2563eb",
      color: "#fff",
      "&:hover": !disabled && !loading ? { background: "#1d4ed8" } : {},
      "&:active": !disabled && !loading ? { background: "#1e40af" } : {},
    },
    secondary: {
      background: "#6b7280",
      color: "#fff",
      "&:hover": !disabled && !loading ? { background: "#4b5563" } : {},
      "&:active": !disabled && !loading ? { background: "#374151" } : {},
    },
    outline: {
      background: "transparent",
      color: "#2563eb",
      border: "1px solid #2563eb",
      "&:hover": !disabled && !loading ? { background: "#f8fafc", borderColor: "#1d4ed8" } : {},
      "&:active": !disabled && !loading ? { background: "#f1f5f9" } : {},
    },
  };

  const currentVariant = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{
        ...baseStyles,
        ...currentVariant,
        opacity: isDisabled ? 0.6 : 1,
        ...(isDisabled ? {} : currentVariant["&:hover"]),
      }}
    >
      {loading && (
        <svg
          className="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            style={{
              animation: "spin 1s linear infinite",
            }}
          />
        </svg>
      )}
      {children}
    </button>
  );
}
