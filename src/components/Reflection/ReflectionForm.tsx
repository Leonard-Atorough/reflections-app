import { useState } from "react";
import type { Reflection } from "../../types/Reflection";
import styles from "./ReflectionForm.module.css";

type props = {
  reflection: Reflection | null;
};

export function ReflectionForm({ reflection }: props) {
  const [title, setTitle] = useState<string>(reflection ? reflection.id : "");
  const [content, setContent] = useState<string>(
    reflection ? reflection.content : ""
  );

  return (
    <form className={styles.formBody}>
      <div className={styles.formHeader}>
        <input
          name="title"
          value={title}
          className={styles.title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>{Date.now().toString()}</p>
      </div>
      <textarea
        name="content"
        value={content}
        className={styles.content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
}
