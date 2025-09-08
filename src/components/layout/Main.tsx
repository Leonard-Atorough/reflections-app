import type { Dispatch, SetStateAction } from "react";
import type { Reflection } from "../../types/Reflection";
import { ReflectionDetail } from "../Reflection/ReflectionDetail";
import { ReflectionForm } from "../Reflection/ReflectionForm";

type props = {
  reflection: Reflection | null;
  setReflections: Dispatch<SetStateAction<Reflection[]>>;
};

export function Main({ reflection, setReflections }: props) {
  return (
    <main>
      {reflection ? (
        <ReflectionDetail reflection={reflection} />
      ) : (
        <ReflectionForm
          reflection={reflection}
          setReflections={setReflections}
        />
      )}
    </main>
  );
}
