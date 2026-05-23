import { type Tag, tagColorMap } from "@/types/Tag";
import styles from "./Tag.module.css";

export function Tag({ name, color }: Tag) {
  return (
    <span className={styles.tag} style={{ backgroundColor: tagColorMap[color] }} title={name}>
      {name}
    </span>
  );
}
