import { useContext } from "react";
import { ReflectionsMenu } from "../components/Reflection/ReflectionsMenu/ReflectionsMenu";
import styles from "./Layout.module.css";
import { ReflectionsContext, UIContext } from "../contexts";
import { Button } from "../components/ui";

export function Aside() {
  const { setIsEditing, sidebarVisible, setSidebarVisible } = useContext(UIContext);
  const { reflections, setSelectedId } = useContext(ReflectionsContext);
  const handleAddButtonCLick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedId(null);
    setSidebarVisible(false);
  };

  return (
    <aside
      className={`${styles.sidebar} ${sidebarVisible ? styles.active : ""}`}
      onClick={() => setIsEditing(false)}
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
