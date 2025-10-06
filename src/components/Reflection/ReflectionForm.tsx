import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import styles from "./ReflectionForm.module.css";

type props = {
  reflection: Reflection | null;
  setReflections: Dispatch<SetStateAction<Reflection[]>>;
};

export function ReflectionForm({ reflection, setReflections }: props) {
  const [title, setTitle] = useState<string>(reflection?.title || "");
  const [content, setContent] = useState<string>(reflection?.content || "");

  useEffect(() => {
    const saveHandler = setTimeout(() => {
      if (title.trim()) {
        setReflections((prev) => {
          const exists = reflection && prev.some((r) => r.id === reflection.id);
          const newOrUpdatedReflection: Reflection = {
            id: reflection?.id ?? uuidv4(),
            title,
            content,
            dateCreated: reflection?.dateCreated ?? Date.now().toLocaleString(),
            dateUpdated: Date.now().toLocaleString(),
          };
          if (exists) {
            return prev.map((r) =>
              r.id === reflection.id ? newOrUpdatedReflection : r
            );
          } else {
            return [...prev, newOrUpdatedReflection];
          }
        });
      }
    }, 500);
    return () => {
      clearTimeout(saveHandler);
    };
  }, [title, content]);

  return (
    <form className={styles.formBody}>
      <div className={styles.formHeader}>
        <input
          name="title"
          aria-label="Title"
          type="text"
          value={title}
          className={styles.title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>{reflection?.dateUpdated}</p>
      </div>
      <textarea
        name="content"
        aria-label="Content"
        value={content}
        className={styles.content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
}
