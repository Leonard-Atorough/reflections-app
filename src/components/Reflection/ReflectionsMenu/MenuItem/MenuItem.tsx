import React, { useContext } from "react";
import type { Reflection } from "../../../../types/Reflection";
import styles from "./MenuItem.module.css";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { ReflectionsContext, EditingContext, SidebarContext } from "../../../../contexts";
import { useReflectionActions } from "@/hooks";

type Props = {
  reflection: Reflection;
};

function ReflectionItemComponent({ reflection }: Props) {
  const { selectedId } = useContext(ReflectionsContext);
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
      role="option"
      data-testid="reflection-button"
      aria-selected={isSelected}
    >
      <h3 className={styles.reflectionTitle}>{reflection.title}</h3>
      <div className={styles.reflectionMeta}>{formattedUpdateDate}</div>
    </li>
  );
}

/**
 * Custom comparison function for ReflectionItem
 * Prevents re-renders when parent list updates if this item hasn't changed
 */
function arePropsEqual(prevProps: Props, nextProps: Props): boolean {
  return (
    prevProps.reflection.id === nextProps.reflection.id &&
    prevProps.reflection.title === nextProps.reflection.title &&
    prevProps.reflection.content === nextProps.reflection.content &&
    prevProps.reflection.dateUpdated === nextProps.reflection.dateUpdated
  );
}

export const ReflectionItem = React.memo(ReflectionItemComponent, arePropsEqual);
