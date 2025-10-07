import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import { ReflectionDetail } from "../Reflection/ReflectionDetail";
import { ReflectionForm } from "../Reflection/ReflectionForm";

type props = {
  reflection: Reflection | null;
  setReflections: Dispatch<SetStateAction<Reflection[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  handleDelete: () => void;
};

export function Main({
  reflection,
  setReflections,
  isEditing,
  setIsEditing,
  handleDelete,
}: props) {
  return (
    <main tabIndex={-1}>
      {isEditing ? (
        <ReflectionForm
          reflection={reflection}
          setReflections={setReflections}
          setIsEditing={setIsEditing}
        />
      ) : (
        <ReflectionDetail
          reflection={reflection}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleDelete={handleDelete}
        />
      )}
    </main>
  );
}
