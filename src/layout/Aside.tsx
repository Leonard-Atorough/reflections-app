import { useContext, useEffect } from "react";
import { ReflectionsMenu } from "../components/Reflection/ReflectionsMenu/ReflectionsMenu";
import styles from "./Layout.module.css";
import { ReflectionsContext, EditingContext, SidebarContext } from "../contexts";
import type { Reflection } from "../types/Reflection";
import { Button } from "../components/ui";
import { useReflectionActions, useResponsive } from "@/hooks";

interface AsideProps {
  reflections?: Reflection[];
}

export function Aside({ reflections: filteredReflections }: AsideProps) {
  const { setIsEditing } = useContext(EditingContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const { reflections: allReflections } = useContext(ReflectionsContext);
  const { setSelectedId } = useReflectionActions();
  const { isMobile, isTablet } = useResponsive();

  // Use filtered reflections if provided, otherwise use all reflections
  const reflections = filteredReflections ?? allReflections;

  // Auto-close sidebar when resizing from mobile/tablet to desktop
  useEffect(() => {
    if (!isMobile && !isTablet && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isMobile, isTablet, isSidebarOpen, setIsSidebarOpen]);

  const handleAddButtonCLick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedId(null);
    setIsSidebarOpen(false);
  };

  return (
    <aside
      className={`${styles.sidebar} ${isSidebarOpen ? styles.active : ""}`}
      onClick={() => setIsEditing(false)}
      data-is-overlay={isMobile || isTablet ? "true" : "false"}
      aria-hidden={!isSidebarOpen && (isMobile || isTablet) ? "true" : "false"}
    >
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>My Reflections</h2>
          <Button variant="outline" aria-label="Add Reflection" onClick={handleAddButtonCLick}>
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
        <ReflectionsMenu reflections={reflections} />
      </div>
    </aside>
  );
}
