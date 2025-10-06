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
        onClick={() => {
          setIsEditing(true);
        }}
        className={styles.reflectionHeader}
        tabIndex={0}
        data-testId="Details header"
      >
        <h2>{reflection?.title}</h2>
        <p>{reflection ? reflection.dateUpdated : ""}</p>
      </div>
      <p
        onClick={() => {
          setIsEditing(true);
        }}
        className={styles.reflectionBody}
        tabIndex={0}
      >
        {reflection?.content ?? ""}
      </p>
      <div>
        <button>DELETE</button>
      </div>
    </>
  );
}
