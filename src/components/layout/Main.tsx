import type { Reflection } from "../../types/Reflection";
import { ReflectionDetail } from "../Reflection/ReflectionDetail";
import { ReflectionForm } from "../Reflection/ReflectionForm";

type props = {
  reflection: Reflection | null;
};

export function Main({ reflection }: props) {
  return (
    <main>
      {reflection ? (
        <ReflectionDetail reflection={reflection} />
      ) : (
        <ReflectionForm reflection={reflection} />
      )}
    </main>
  );
}
