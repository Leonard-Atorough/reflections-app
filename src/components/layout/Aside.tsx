import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import { ReflectionItem } from "../Reflection/ReflectionItem";
import styles from "./Layout.module.css";

type props = {
  reflections: Reflection[];
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

export function Aside({
  reflections,
  selectedId,
  onSelect,
  isEditing,
  setIsEditing,
}: props) {
  return (
    <aside>
      <div>
        <h2>Reflections</h2>
        <ul>
          {reflections.map((reflection) => {
            return (
              <ReflectionItem
                key={reflection.id}
                reflection={reflection}
                onSelect={onSelect}
                isSelected={reflection.id === selectedId}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            );
          })}
        </ul>
      </div>
      <div className={styles.addButton}>
        <button onClick={() => onSelect(null)}>Add Reflection</button>
      </div>
    </aside>
  );
}
