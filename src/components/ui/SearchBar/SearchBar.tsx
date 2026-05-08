import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch?: (term: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search reflections...",
  ariaLabel = "Search Reflections",
}: SearchBarProps) {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchInput}
        aria-label={ariaLabel}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="20"
        height="20"
        className={styles.searchIcon}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="4" fill="none" />
        <line x1="16.5" y1="16.5" x2="35" y2="35" stroke="currentColor" strokeWidth="4" />
      </svg>
    </div>
  );
}
