import React, { useContext } from "react";
import type { Reflection } from "@/types/Reflection";
import { arePropsEqual } from "@/types/Reflection";
import styles from "./MenuItem.module.css";
import { useFormattedDate } from "@hooks/useFormattedDate";
import {
  ReflectionsContext,
  EditingContext,
  SidebarContext,
  type ReflectionsContextType,
} from "@contexts";
import { useReflectionActions } from "@/hooks";
import { Tag } from "@/components/ui/Tag/Tag";

type Props = {
  reflection: Reflection;
};

function ReflectionItemComponent({ reflection }: Props) {
  const { selectedId } = useContext(ReflectionsContext) as ReflectionsContextType;
  const { setSelectedId } = useReflectionActions();
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
      role="listitem"
      data-testid="reflection-button"
      aria-selected={isSelected}
    >
      <h3 className={styles.reflectionTitle}>{reflection.title}</h3>
      <div className={styles.reflectionMeta}>
        <Tag name={reflection.tag?.name || "Untagged"} color={reflection.tag?.color || "gray"} />
        <div className={styles.reflectionDate}>{formattedUpdateDate}</div>
      </div>
    </li>
  );
}

export const ReflectionItem = React.memo(ReflectionItemComponent, arePropsEqual);
