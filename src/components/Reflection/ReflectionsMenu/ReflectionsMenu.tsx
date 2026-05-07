import type { Reflection } from "../../../types/Reflection";
import { MenuItem } from "./MenuItem/MenuItem";
import styles from "./ReflectionsMenu.module.css";

type Props = {
  reflections: Reflection[];
};

export function ReflectionsMenu({ reflections }: Props) {
  return (
    <ul role="listbox" aria-label="Reflections List" className={styles.list}>
      {reflections.map((reflection) => (
        <MenuItem key={reflection.id} reflection={reflection} />
      ))}
    </ul>
  );
}
