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
  const [localReflection] = useState<Reflection>(
    () =>
      reflection ?? {
        id: uuidv4(),
        title: "",
        content: "",
        dateCreated: Date.now().toString(),
        dateUpdated: Date.now().toString(),
      }
  );

  useEffect(() => {
    const saveHandler = setTimeout(() => {
      if (title.trim()) {
        setReflections((prev) => {
          const exists = prev.some((r) => r.id === localReflection?.id);
          const newOrUpdatedReflection: Reflection = reflection ?? {
            ...localReflection,
            title,
            content,
            dateUpdated: Date.now().toString(),
          };
          if (exists) {
            return prev.map((r) =>
              r.id === localReflection.id ? newOrUpdatedReflection : r
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
        <p>{Date.now().toString()}</p>
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
