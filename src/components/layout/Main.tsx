import { useContext, type Dispatch, type SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import { ReflectionDetail } from "../Reflection/ReflectionDetail";
import { ReflectionForm } from "../Reflection/ReflectionForm";
import { UIContext } from "../../contexts";

type props = {
  reflection: Reflection | null;
  setReflections: Dispatch<SetStateAction<Reflection[]>>;
  handleDelete: () => void;
};

export function Main({ reflection, setReflections, handleDelete }: props) {
  const { isEditing } = useContext(UIContext);
  return (
    <main tabIndex={-1}>
      {isEditing ? (
        <ReflectionForm reflection={reflection} setReflections={setReflections} />
      ) : (
        <ReflectionDetail reflection={reflection} handleDelete={handleDelete} />
      )}
    </main>
  );
}
