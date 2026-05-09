import { useCallback, useContext, useState } from "react";
import { useFormattedDate } from "@hooks/useFormattedDate";
import { ReflectionsContext, EditingContext, type ReflectionsContextType } from "@contexts";
import type { Reflection } from "@/types/Reflection";
import { Button, Dialog, TrashIcon } from "../ui";
import { useReflectionActions } from "@hooks";

export function ReflectionDetail({ reflection }: { reflection: Reflection | null }) {
  const { setIsEditing } = useContext(EditingContext);
  const { selectedId } = useContext(ReflectionsContext) as ReflectionsContextType;
  const { deleteReflection } = useReflectionActions();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated ?? Date.now());
  const isPlaceholder = !reflection || reflection.content.trim() === "";

  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    deleteReflection(selectedId);
    setIsEditing(false);
    setIsDeleteDialogOpen(false);
  }, [selectedId, deleteReflection, setIsEditing]);

  return (
    <>
      <div className="body">
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter") setIsEditing(true);
          }}
          onClick={() => {
            setIsEditing(true);
          }}
          className="header"
          tabIndex={0}
          data-testid="details-title"
        >
          <div className="titleWrapper">
            <h2
              className={"title" + (isPlaceholder ? " placeholder" : "")}
              aria-label={reflection?.title || "Empty Reflections Title"}
            >
              {reflection?.title || "Untitled Reflection"}
            </h2>
            <div className="actions">
              {reflection && (
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                  }}
                  ariaLabel="Delete Reflection"
                  data-testid="delete-reflection-button"
                >
                  <TrashIcon size={20} />
                </Button>
              )}
            </div>
          </div>
          <div className="metadata">
            <p className="date">{formattedUpdateDate}</p>
          </div>
        </div>
        <p
          onClick={() => {
            setIsEditing(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") setIsEditing(true);
          }}
          className="content"
          tabIndex={0}
          data-testid="details-body"
        >
          {reflection?.content ?? ""}
        </p>
      </div>
      {/* dialog is always rendered but its visibility is controlled by style */}
      <Dialog
        style={{
          opacity: isDeleteDialogOpen ? 1 : 0,
          pointerEvents: isDeleteDialogOpen ? "auto" : "none",
          visibility: isDeleteDialogOpen ? "visible" : "hidden",
        }}
        title="Delete Reflection"
        content="Are you sure you want to delete this reflection? This action cannot be undone."
        onAccept={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}
