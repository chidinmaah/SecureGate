import React, { useId, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function joinClasses(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type = "text", ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <div className="space-y-1.5 w-full">
        <label htmlFor={id} className="text-sm font-semibold text-text">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={resolvedType}
            className={joinClasses(
              "input-field",
              isPassword && "pr-10",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} className="text-xs text-error font-medium">
            {error}
          </p>
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
      className={joinClasses("btn-primary inline-flex items-center justify-center gap-2", className)}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
    <div
      role="alert"
      className={joinClasses(
        "border-l-4 p-4 text-sm font-medium rounded-r-md",
        styles[type]
      )}
    >
      {children}
    </div>
  );
};
