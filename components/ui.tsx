import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        <label className="text-sm font-semibold text-text">
          {label}
        </label>
        <input
          ref={ref}
          className={cn(
            "input-field",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-error font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  isLoading, 
  className, 
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn("btn-primary", className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
};

interface AlertProps {
  type: "success" | "error" | "warning";
  children: React.ReactNode;
}

export const Alert = ({ type, children }: AlertProps) => {
  const styles = {
    success: "bg-success-bg border-success text-success",
    error: "bg-error-bg border-error text-error",
    warning: "bg-warning-bg border-warning text-warning",
  };

  return (
    <div className={cn(
      "border-l-4 p-4 text-sm font-medium rounded-r-md",
      styles[type]
    )}>
      {children}
    </div>
  );
};
