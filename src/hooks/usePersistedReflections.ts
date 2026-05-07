import { useEffect, useRef, useState } from "react";
import type { Reflection } from "../types/Reflection";

const DEBOUNCE_MS = 500;

export function usePersistReflections(reflections: Reflection[]) {
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reflections.length === 0) {
      setStatus("idle");
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setStatus("saving");
      try {
        localStorage.setItem("reflections", JSON.stringify(reflections));
        setStatus("idle");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reflections]);

  return { status };
}
