import { useContext } from "react";
import { ReflectionItem } from "../Reflection/ReflectionItem";
import styles from "./Layout.module.css";
import { ReflectionsContext, UIContext } from "../../contexts";

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
      <div>
        <h2>Reflections</h2>
        <ul role="listbox" aria-label="Reflections List">
          {reflections.map((reflection) => {
            return <ReflectionItem key={reflection.id} reflection={reflection} />;
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
