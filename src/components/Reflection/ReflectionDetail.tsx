import type { Reflection } from "../../types/Reflection";
import styles from "./ReflectionDetail.module.css";

type props = {
  reflection: Reflection;
};

export function ReflectionDetail({ reflection }: props) {
  return (
    <>
      <div className={styles.reflectionHeader}>
        <h2>{reflection.title}</h2>
        <p>Last updated: {reflection.dateUpdated}</p>
      </div>
      <p className={styles.reflectionBody} tabIndex={0}>
        {reflection.content.split("<br/>").map((line, idx) => (
          <span key={idx}>
            {line}
            <br />
            <br />
          </span>
        ))}
      </p>
    </>
  );
}
