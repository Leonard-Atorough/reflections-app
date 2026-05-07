import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useRef, useState } from "react";
import type { Reflection } from "../../types/Reflection";
import styles from "./ReflectionForm.module.css";

import { useFormattedDate } from "../../hooks/useFormattedDate";
import { ReflectionsContext, UIContext } from "../../contexts";

type props = {
  reflection: Reflection | null;
};

export function ReflectionForm({ reflection }: props) {
  const { setIsEditing } = useContext(UIContext);
  const { setReflections } = useContext(ReflectionsContext);

  const [title, setTitle] = useState<string>(reflection?.title || "");
  const [content, setContent] = useState<string>(reflection?.content || "");

  const idRef = useRef<string>(reflection?.id ?? uuidv4());
  
  useEffect(() => {
    idRef.current = reflection?.id ?? uuidv4();
    setTitle(reflection?.title || "");
    setContent(reflection?.content || "");
  }, [reflection]);

  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated ?? Date.now());

  useEffect(() => {
    const saveHandler = setTimeout(() => {
      if (title.trim()) {
        setReflections((prev) => {
          const exists = prev.some((r) => r.id === idRef.current);
          const newOrUpdatedReflection: Reflection = {
            id: idRef.current,
            title,
            content,
            dateCreated: reflection?.dateCreated ?? Date.now(),
            dateUpdated: Date.now(),
          };
          if (exists) {
            return prev.map((r) => (r.id === idRef.current ? newOrUpdatedReflection : r));
          } else {
            return [...prev, newOrUpdatedReflection];
          }
        });
      }
    }, 500);
    return () => {
      clearTimeout(saveHandler);
    };
  }, [title, content, setReflections, reflection?.dateCreated]);

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
