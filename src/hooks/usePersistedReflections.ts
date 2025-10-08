import { useEffect, useState } from "react";
import type { Reflection } from "../types/Reflection";

export function usePersistReflections(reflections: Reflection[]) {
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  useEffect(() => {
    if (reflections.length === 0) {
      setStatus("idle");
      return;
    }

    const persist = () => {
      setStatus("saving");
      try {
        localStorage.setItem("reflections", JSON.stringify(reflections));
        setStatus("idle");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };
    persist();
  }, [reflections]);

  return { status };
}
