import { useContext } from "react";
import styles from "./Layout.module.css";
import { SidebarContext, EditingContext } from "../contexts";
import { Button } from "../components/ui";
import { SearchBar } from "../components/ui/SearchBar/SearchBar";
import { useReflectionActions, useResponsive, useTheme } from "@/hooks";

interface HeaderProps {
  onSearch?: (term: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
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
            ariaLabel="Open menu"
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
          <Button
            variant="primary"
            onClick={handleAddButtonCLick}
            ariaLabel="Add new reflection"
            square
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="4"/>
              <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="4" />
            </svg>
          </Button>
        )}
        <Button
          variant="outline"
          onClick={toggleTheme}
          ariaLabel={`toggle ${theme === "light" ? "dark" : "light"} mode`}
          square
        >
          {theme === "light" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
              <line
                x1="18.36"
                y1="18.36"
                x2="19.78"
                y2="19.78"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
              <line
                x1="4.22"
                y1="19.78"
                x2="5.64"
                y2="18.36"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="18.36"
                y1="5.64"
                x2="19.78"
                y2="4.22"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path d="M21.64 13.64A9 9 0 1 1 12.36 2.36a7 7 0 0 0 9.28 11.28z" />
            </svg>
          )}
        </Button>
      </div>
    </header>
  );
}
