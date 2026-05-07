import { useContext } from "react";
import styles from "./Layout.module.css";
import { ReflectionsContext, UIContext } from "../contexts";
import { Button } from "../components/ui";

export function Header() {
  const { setIsEditing, sidebarVisible, setSidebarVisible } = useContext(UIContext);
  const { setSelectedId } = useContext(ReflectionsContext);
  const handleAddButtonCLick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedId(null);
    setSidebarVisible(false);
  };

  return (
    <header onClick={() => setIsEditing(false)} className={styles.headerSection}>
      <div>
        <Button
          variant="outline"
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className={`btn ${styles.hamburgerMenu}`}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </Button>
        <h1 className={styles.title}>Reflections</h1>
      </div>
      <Button variant="primary" onClick={handleAddButtonCLick} className={styles.addButton}>
        Add Reflection
      </Button>
    </header>
  );
}
