import { useContext } from "react";
import { ReflectionDetail } from "../Reflection/ReflectionDetail";
import { ReflectionForm } from "../Reflection/ReflectionForm";
import { ReflectionsContext, UIContext } from "../../contexts";

export function Main() {
  const { isEditing } = useContext(UIContext);
  const { reflections, selectedId } = useContext(ReflectionsContext);

  const reflection = reflections.find((r) => r.id === selectedId) ?? null;
  return (
    <main tabIndex={-1}>
      {isEditing ? (
        <ReflectionForm reflection={reflection} />
      ) : (
        <ReflectionDetail reflection={reflection} />
      )}
    </main>
  );
}
