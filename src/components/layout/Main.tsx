import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import { ReflectionDetail } from "../Reflection/ReflectionDetail";
import { ReflectionForm } from "../Reflection/ReflectionForm";

type props = {
  reflection: Reflection | null;
  setReflections: Dispatch<SetStateAction<Reflection[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

export function Main({
  reflection,
  setReflections,
  isEditing,
  setIsEditing,
}: props) {
  return (
    <main>
      {reflection ? (
        isEditing ? (
          <ReflectionForm
            reflection={reflection}
            setReflections={setReflections}
          />
        ) : (
          <ReflectionDetail
            reflection={reflection}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )
      ) : (
        <ReflectionDetail
          reflection={reflection}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
    </main>
  );
}
