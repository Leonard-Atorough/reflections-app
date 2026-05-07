import { useContext } from "react";
import styles from "./Layout.module.css";
import { ReflectionsContext, UIContext } from "../contexts";

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
        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className={`btn ${styles.hamburgerMenu}`}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
        <h1 className={styles.title}>Reflections</h1>
      </div>
      <button className={`btn ${styles.addButton}`} onClick={handleAddButtonCLick}>
        <img src="/assets/icons8-add-ios-17-glyph/icons8-add-30.png" />
      </button>
    </header>
  );
}
