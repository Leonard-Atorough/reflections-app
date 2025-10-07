import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import styles from "./ReflectionItem.module.css";
import { useFormattedDate } from "../../hooks/useFormattedDate";

type Props = {
  reflection: Reflection;
  setSelectedId: (id: string | null) => void;
  isSelected: boolean;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

export function ReflectionItem({
  reflection,
  isSelected,
  setSelectedId,
  isEditing,
  setIsEditing,
}: Props) {
  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated);

  const handleToggle = () => {
    setSelectedId(isSelected ? null : reflection.id);
    if (isEditing) setIsEditing(false);
  };
  return (
    <li
      className={`${styles.reflectionItem} ${
        isSelected ? styles.selected : ""
      }`}
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
      <div>{formattedUpdateDate}</div>
    </li>
  );
}
