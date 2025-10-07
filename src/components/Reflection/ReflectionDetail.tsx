import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import styles from "./ReflectionDetail.module.css";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import { keyboard } from "@testing-library/user-event/dist/cjs/keyboard/index.js";

type props = {
  reflection: Reflection | null;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isEditing: boolean;
  handleDelete: () => void;
};

export function ReflectionDetail({
  reflection,
  setIsEditing,
  handleDelete,
}: props) {
  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated);

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
        <h2>{reflection?.title}</h2>
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
      <div>
        <button onClick={handleDelete}>DELETE</button>
      </div>
    </>
  );
}
