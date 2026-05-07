import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

const variantClassMap: Record<ButtonVariant, string> = {
  primary: styles["btn-primary"],
  secondary: styles["btn-secondary"],
  outline: styles["btn-outline"],
  danger: styles["btn-danger"],
};

export function Button({
  variant,
  children,
  onClick,
  className,
}: {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  return (
    <button
      className={`btn ${variantClassMap[variant || "primary"]} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
