import { useContext, useEffect, useRef, useState } from "react";
import type { Reflection } from "../../types/Reflection";
import styles from "./ReflectionForm.module.css";

import { useFormattedDate } from "../../hooks/useFormattedDate";
import { EditingContext, ReflectionsContext } from "@contexts";
import { useReflectionActions } from "@/hooks";
import { DEBOUNCE_DELAYS } from "@/config/constants";

type props = {
  reflection: Reflection | null;
};

export function ReflectionForm({ reflection }: props) {
  const { setIsEditing } = useContext(EditingContext);
  const { reflections } = useContext(ReflectionsContext);
  const { addReflection, updateReflection } = useReflectionActions();

  const [title, setTitle] = useState<string>(reflection?.title || "");
  const [content, setContent] = useState<string>(reflection?.content || "");

  const idRef = useRef<string>(reflection?.id ?? crypto.randomUUID());

  useEffect(() => {
    idRef.current = reflection?.id ?? crypto.randomUUID();
    setTitle(reflection?.title || "");
    setContent(reflection?.content || "");
  }, [reflection]);

  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated ?? Date.now());

  useEffect(() => {
    const saveHandler = setTimeout(() => {
      if (title.trim()) {
        // Check if this ID already exists in reflections (handles new reflections on keystroke)
        const exists = reflections.some((r) => r.id === idRef.current);
        const newOrUpdatedReflection: Reflection = {
          id: idRef.current,
          title,
          content,
          dateCreated: reflection?.dateCreated ?? Date.now(),
          dateUpdated: Date.now(),
        };
        if (exists) {
          updateReflection(newOrUpdatedReflection);
        } else {
          addReflection(newOrUpdatedReflection);
        }
      }
    }, DEBOUNCE_DELAYS.FORM_AUTO_SAVE);
    return () => {
      clearTimeout(saveHandler);
    };
  }, [title, content, reflection?.dateCreated, reflections, updateReflection, addReflection]);

  return (
    <form
      className={styles.formBody}
      onKeyDown={(e) => {
        if (e.key === "Escape") setIsEditing(false);
      }}
    >
      <div className={styles.formHeader}>
        <input
          name="title"
          aria-label="Title"
          type="text"
          placeholder="Add a Title"
          value={title}
          className={styles.title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>{formattedUpdateDate}</p>
      </div>
      <textarea
        name="content"
        aria-label="Content"
        placeholder="Add some reflections..."
        value={content}
        className={styles.content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
}
