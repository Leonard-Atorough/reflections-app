import { useContext } from "react";
import styles from "./Layout.module.css";
import { ReflectionsContext, UIContext } from "../contexts";
import { Button } from "../components/ui";

interface HeaderProps {
  onSearch?: (term: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { setIsEditing, sidebarVisible, setSidebarVisible } = useContext(UIContext);
  const { setSelectedId } = useContext(ReflectionsContext);
  const handleAddButtonCLick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedId(null);
    setSidebarVisible(false);
  };

  return (
    <header onClick={() => setIsEditing(false)} className={styles.header}>
      <div className={styles.headerLeft}>
        <Button
          variant="outline"
          size="small"
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className={`btn ${styles.hamburgerMenu}`}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </Button>
        <h1 className={styles.title}>Reflections</h1>
      </div>
      <div className={styles.headerCenter}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search reflections..."
            className={styles.searchInput}
            aria-label="Search Reflections"
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="20"
            height="20"
            className={styles.searchIcon}
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="4" fill="none" />
            <line x1="16.5" y1="16.5" x2="35" y2="35" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>
      </div>
      <div className={styles.headerRight}>
        <Button variant="primary" onClick={handleAddButtonCLick} className={styles.addButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="20"
            height="20"
          >
            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </Button>
      </div>
    </header>
  );
}
