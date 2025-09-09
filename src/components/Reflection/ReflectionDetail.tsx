import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import styles from "./ReflectionDetail.module.css";

type props = {
  reflection: Reflection | null;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isEditing: boolean;
};

export function ReflectionDetail({ reflection, setIsEditing }: props) {
  return (
    <>
      <div
        onFocus={() => {
          setIsEditing(true);
        }}
        className={styles.reflectionHeader}
        tabIndex={0}
      >
        <h2
          onClick={() => {
            setIsEditing(true);
          }}
        >
          {reflection?.title}
        </h2>
        <p>Last updated: {reflection?.dateUpdated}</p>
      </div>
      <p
        onClick={() => {
          setIsEditing(true);
        }}
        className={styles.reflectionBody}
        tabIndex={0}
      >
        {reflection?.content.split("<br/>").map((line, idx) => (
          <span key={idx}>
            {line}
            <br />
            <br />
          </span>
        ))}
      </p>
      <div>
        <button>EDIT</button>
        <button>DELETE</button>
      </div>
    </>
  );
}
