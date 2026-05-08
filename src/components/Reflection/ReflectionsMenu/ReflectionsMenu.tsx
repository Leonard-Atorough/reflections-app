import React from "react";
import type { Reflection } from "../../../types/Reflection";
import { ReflectionItem } from "./MenuItem/MenuItem";
import styles from "./ReflectionsMenu.module.css";

type Props = {
  reflections: Reflection[];
};

export const ReflectionsMenu = React.memo(({ reflections }: Props) => {
  return (
    <ul role="listbox" aria-label="Reflections List" className={styles.list}>
      {reflections.map((reflection) => (
        <ReflectionItem key={reflection.id} reflection={reflection} />
      ))}
    </ul>
  );
});
