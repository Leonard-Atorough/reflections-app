import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import { ReflectionItem } from "../Reflection/ReflectionItem";
import styles from "./Layout.module.css";

type props = {
  reflections: Reflection[];
  setSelectedId: (id: string | null) => void;
  selectedId: string | null;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setSidebarVisible: Dispatch<SetStateAction<boolean>>;
  sidebarVisible: boolean;
};

export function Aside({
  reflections,
  selectedId,
  setSelectedId,
  isEditing,
  setIsEditing,
  sidebarVisible,
  setSidebarVisible,
}: props) {
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
      <div>
        <h2>Reflections</h2>
        <ul role="listbox" aria-label="Reflections List">
          {reflections.map((reflection) => {
            return (
              <ReflectionItem
                key={reflection.id}
                reflection={reflection}
                setSelectedId={setSelectedId}
                isSelected={reflection.id === selectedId}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setSidebarVisible={setSidebarVisible}
              />
            );
          })}
        </ul>
      </div>
      <div className={styles.addButton}>
        <button className="btn" onClick={handleAddButtonCLick}>
          ADD REFLECTION
        </button>
      </div>
    </aside>
  );
}
