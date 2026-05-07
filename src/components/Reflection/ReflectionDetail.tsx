import { useCallback, useContext } from "react";
import styles from "./ReflectionDetail.module.css";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import { ReflectionsContext, UIContext } from "../../contexts";
import type { Reflection } from "../../types/Reflection";
import { Button } from "../ui";

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
  const { setIsEditing } = useContext(UIContext);
  const { reflections, setReflections, selectedId, setSelectedId } = useContext(ReflectionsContext);

  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated ?? Date.now());

  const handleDelete = useCallback(() => {
    if (!selectedId) return;

    if (!window.confirm("Delete this reflection? This action cannot be undone!")) return;

    setReflections((prev) => {
      const filtered = prev.filter((r) => r.id !== selectedId) ?? null;
      return filtered ?? [];
    });

    setSelectedId((prev) => {
      const newList = reflections.filter((r) => r.id !== prev);
      const last = newList.at(-1) ?? null;
      return last ? last.id : null;
    });
    setIsEditing(false);
  }, [selectedId, setReflections, setSelectedId, setIsEditing, reflections]);

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
