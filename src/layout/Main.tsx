import { useContext } from "react";
import { ReflectionDetail } from "../components/Reflection/ReflectionDetail";
import { ReflectionForm } from "../components/Reflection/ReflectionForm";
import { ReflectionsContext, EditingContext } from "../contexts";
import style from "./Layout.module.css";

export function Main() {
  const { isEditing } = useContext(EditingContext);
  const { reflections, selectedId } = useContext(ReflectionsContext);

  const reflection = reflections.find((r) => r.id === selectedId) ?? null;
  return (
    <main className={style.main} tabIndex={-1}>
      {isEditing ? (
        <ReflectionForm reflection={reflection} />
      ) : (
        <ReflectionDetail reflection={reflection} />
      )}
    </main>
  );
}
