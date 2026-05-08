import { useCallback, useContext } from "react";
import styles from "./ReflectionDetail.module.css";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import { ReflectionsContext, EditingContext } from "../../contexts";
import type { Reflection } from "../../types/Reflection";
import { Button } from "../ui";
import { useReflectionActions } from "@hooks";

type buttonProps = {
  hasReflection: boolean;
  handleDelete: () => void;
};

function DeleteButton({ hasReflection, handleDelete }: buttonProps) {
  if (hasReflection) {
    return (
      <div>
        <Button variant="danger" onClick={handleDelete}>
          Delete Reflection
        </Button>
      </div>
    );
  }
}

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
        className={styles.reflectionHeader}
        tabIndex={0}
        data-testid="details-title"
      >
        <h2 aria-label={reflection?.title ?? "Empty Reflections Title"}>{reflection?.title}</h2>
        <p>{reflection ? formattedUpdateDate : ""}</p>
      </div>
      <p
        onClick={() => {
          setIsEditing(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsEditing(true);
        }}
        className={styles.reflectionBody}
        tabIndex={0}
        data-testid="details-body"
      >
        {reflection?.content ?? ""}
      </p>
      <DeleteButton hasReflection={reflection ? true : false} handleDelete={handleDelete} />
    </>
  );
}
