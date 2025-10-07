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
};

export function Aside({
  reflections,
  selectedId,
  setSelectedId,
  isEditing,
  setIsEditing,
}: props) {
  const handleAddButtonCLick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedId(null);
  };
  return (
    <aside onClick={() => setIsEditing(false)}>
      <div>
        <h2>Reflections</h2>
        <ul>
          {reflections.map((reflection) => {
            return (
              <ReflectionItem
                key={reflection.id}
                reflection={reflection}
                setSelectedId={setSelectedId}
                isSelected={reflection.id === selectedId}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            );
          })}
        </ul>
      </div>
      <div className={styles.addButton}>
        <button onClick={handleAddButtonCLick}>Add Reflection</button>
      </div>
    </aside>
  );
}
