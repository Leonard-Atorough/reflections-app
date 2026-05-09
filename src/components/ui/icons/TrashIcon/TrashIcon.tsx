import styles from "./TrashIcon.module.css";

interface TrashIconProps {
  size?: number;
  className?: string;
}

export function TrashIcon({ size = 24, className = "" }: TrashIconProps) {
  return (
    <svg
      className={`${styles.trashIcon} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Lid group - lifts up on idle/hover */}
      <g className={styles.lidGroup}>
        {/* Lid line */}
        <path d="M3 6h18" />

        {/* Lid handle */}
        <rect x="8" y="2" width="8" height="2" rx="1" />

        {/* Lid line connection points */}
        <line x1="4" y1="6" x2="6" y2="9" />
        <line x1="20" y1="6" x2="18" y2="9" />
      </g>

      {/* Bin body */}
      <path d="M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" className={styles.body} />

      {/* Items inside */}
      <line x1="9" y1="11" x2="9" y2="17" className={styles.item} />
      <line x1="15" y1="11" x2="15" y2="17" className={styles.item} />
    </svg>
  );
}
