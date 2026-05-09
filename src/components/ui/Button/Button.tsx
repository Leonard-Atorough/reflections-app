import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
export type ButtonSize = "small" | "medium" | "large";

const variantClassMap: Record<ButtonVariant, string> = {
  primary: styles["btn-primary"],
  secondary: styles["btn-secondary"],
  outline: styles["btn-outline"],
  danger: styles["btn-danger"],
};

const sizeClassMap: Record<ButtonSize, string> = {
  small: styles["btn-small"],
  medium: styles["btn-medium"],
  large: styles["btn-large"],
};

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  ariaLabel?: string;
  "data-testid"?: string;
}

export function Button({
  variant,
  children,
  onClick,
  className,
  size,
  ariaLabel,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn ${variantClassMap[variant || "primary"]} ${sizeClassMap[size || "medium"]} ${className || ""}`}
      onClick={onClick}
      aria-label={ariaLabel || (typeof children === "string" ? children : undefined)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
