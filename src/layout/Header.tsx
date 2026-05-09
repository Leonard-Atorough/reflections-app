import { useContext } from "react";
import styles from "./Layout.module.css";
import { SidebarContext, EditingContext } from "../contexts";
import { Button } from "../components/ui";
import { SearchBar } from "../components/ui/SearchBar/SearchBar";
import { useReflectionActions, useResponsive } from "@/hooks";

interface HeaderProps {
  onSearch?: (term: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { isMobile, isTablet } = useResponsive();
  const { setIsEditing } = useContext(EditingContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const { setSelectedId } = useReflectionActions();
  const handleAddButtonCLick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedId(null);
    setIsSidebarOpen(false);
  };

  return (
    <header onClick={() => setIsEditing(false)} className={styles.header}>
      <div className={styles.headerLeft}>
        {(isMobile || isTablet) && (
          <Button
            variant="outline"
            size="small"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`btn ${styles.hamburgerMenu}`}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </Button>
        )}
        <h1 className={styles.title}>Reflections</h1>
      </div>
      <div className={styles.headerCenter}>{!isMobile && <SearchBar onSearch={onSearch} />}</div>
      <div className={styles.headerRight}>
        {isMobile && (
          <Button variant="primary" onClick={handleAddButtonCLick} ariaLabel="Add new reflection">
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
        )}
      </div>
    </header>
  );
}
