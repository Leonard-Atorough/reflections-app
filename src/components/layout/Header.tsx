import type { Dispatch, SetStateAction } from "react";
import styles from "./Layout.module.css";

type props = {
  setSelectedId: (id: string | null) => void;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setSidebarVisible: Dispatch<SetStateAction<boolean>>;
  sidebarVisible: boolean;
};

export function Header({
  setSelectedId,
  setIsEditing,
  setSidebarVisible,
  sidebarVisible,
}: props) {
  const handleAddButtonCLick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedId(null);
    setSidebarVisible(false);
  };

  return (
    <header
      onClick={() => setIsEditing(false)}
      className={styles.headerSection}
    >
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
      <button
        className={`btn ${styles.addButton}`}
        onClick={handleAddButtonCLick}
      >
        <img src="/assets/icons8-add-ios-17-glyph/icons8-add-30.png" />
      </button>
    </header>
  );
}
