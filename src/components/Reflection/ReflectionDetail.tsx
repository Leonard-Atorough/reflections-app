import { useCallback, useContext } from "react";
import styles from "./ReflectionDetail.module.css";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import { ReflectionsContext, EditingContext } from "../../contexts";
import type { Reflection } from "../../types/Reflection";
import { Button, TrashIcon } from "../ui";
import { useReflectionActions } from "@hooks";

export function ReflectionDetail({ reflection }: { reflection: Reflection | null }) {
  const { setIsEditing } = useContext(EditingContext);
  const { selectedId } = useContext(ReflectionsContext);
  const { deleteReflection } = useReflectionActions();

  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated ?? Date.now());

  const handleDelete = useCallback(() => {
    if (!selectedId) return;

    if (!window.confirm("Delete this reflection? This action cannot be undone!")) return;

    deleteReflection(selectedId);

    setIsEditing(false);
  }, [selectedId, deleteReflection, setIsEditing]);

  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsEditing(true);
        }}
        onClick={() => {
          setIsEditing(true);
        }}
        className={styles.header}
        tabIndex={0}
        data-testid="details-title"
      >
        <div className={styles.titleWrapper}>
          <h2 className={styles.title} aria-label={reflection?.title ?? "Empty Reflections Title"}>
            {reflection?.title}
          </h2>
          <div className={styles.actions}>
            {reflection && (
              <Button variant="danger" onClick={handleDelete}>
                <TrashIcon size={20} />
              </Button>
            )}
          </div>
        </div>
        <p>{reflection ? formattedUpdateDate : ""}</p>
      </div>
      <p
        onClick={() => {
          setIsEditing(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsEditing(true);
        }}
        className={styles.content}
        tabIndex={0}
        data-testid="details-body"
      >
        {reflection?.content ?? ""}
      </p>
    </>
  );
}
