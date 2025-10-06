import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import styles from "./ReflectionForm.module.css";

import { useFormattedDate } from "../../hooks/dateFormatter";

type props = {
  reflection: Reflection | null;
  setReflections: Dispatch<SetStateAction<Reflection[]>>;
};

export function ReflectionForm({ reflection, setReflections }: props) {
  const [title, setTitle] = useState<string>(reflection?.title || "");
  const [content, setContent] = useState<string>(reflection?.content || "");

  const idRef = useRef<string>(reflection?.id ?? uuidv4());

  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated);

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
            return prev.map((r) =>
              r.id === idRef.current ? newOrUpdatedReflection : r
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
  }, [title, content, setReflections, reflection?.dateCreated]);

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
        <p>{formattedUpdateDate}</p>
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
