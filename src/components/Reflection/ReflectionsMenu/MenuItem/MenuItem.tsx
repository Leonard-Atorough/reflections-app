import { useContext } from "react";
import type { Reflection } from "../../../../types/Reflection";
import styles from "./MenuItem.module.css";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { ReflectionsContext, EditingContext, SidebarContext } from "../../../../contexts";

type Props = {
  reflection: Reflection;
};

export function MenuItem({ reflection }: Props) {
  const { selectedId, setSelectedId } = useContext(ReflectionsContext);
  const { isEditing, setIsEditing } = useContext(EditingContext);
  const { setIsSidebarOpen } = useContext(SidebarContext);

  const isSelected = selectedId === reflection.id;
  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated);

  const handleToggle = () => {
    setSelectedId(isSelected ? null : reflection.id);
    if (isEditing) setIsEditing(false);
    if (!isEditing && !isSelected) setIsSidebarOpen(false);
  };
  return (
    <li
      className={`${styles.reflectionItem} ${isSelected ? styles.selected : ""}`}
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleToggle();
        }
      }}
      role="option"
      data-testid="reflection-button"
      aria-selected={isSelected}
    >
      <h3 className={styles.reflectionTitle}>{reflection.title}</h3>
      <div className={styles.reflectionMeta}>{formattedUpdateDate}</div>
    </li>
  );
}
