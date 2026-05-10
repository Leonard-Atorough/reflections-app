import { useEffect, useRef } from "react";
import type { Reflection } from "../types/Reflection";
import { DEBOUNCE_DELAYS } from "@/config/constants";
import { useReflectionActions } from "./useReflectionActions";

interface UseFormAutoSaveOptions {
  title: string;
  content: string;
  reflections: Reflection[];
  reflection: Reflection | null;
}

/**
 * Custom hook for managing form auto-save with debounce
 * Decoupled from ReflectionForm to support different editors
 *
 * @example
 * useFormAutoSave({
 *   title,
 *   content,
 *   reflections,
 *   reflection,
 * });
 */
export function useFormAutoSave({
  title,
  content,
  reflections,
  reflection,
}: UseFormAutoSaveOptions): void {
  const idRef = useRef<string>(reflection?.id ?? crypto.randomUUID());
  const { addReflection, updateReflection } = useReflectionActions();

  useEffect(() => {
    idRef.current = reflection?.id ?? crypto.randomUUID();
  }, [reflection?.id]);

  useEffect(() => {
    const saveHandler = setTimeout(() => {
      if (title.trim()) {
        // Check if this ID already exists in reflections
        const exists = reflections.some((r) => r.id === idRef.current);
        const newOrUpdatedReflection: Reflection = {
          id: idRef.current,
          title,
          content,
          dateCreated: reflection?.dateCreated ?? Date.now(),
          dateUpdated: Date.now(),
          contentFormat: reflection?.contentFormat ?? "plaintext",
        };

        // Only save if changed from previous state
        if (exists) {
          const existing = reflections.find((r) => r.id === idRef.current);
          if (
            existing &&
            (existing.title !== title ||
              existing.content !== content ||
              existing.contentFormat !== (reflection?.contentFormat ?? "plaintext"))
          ) {
            updateReflection(newOrUpdatedReflection);
          }
        } else {
          addReflection(newOrUpdatedReflection);
        }
      }
    }, DEBOUNCE_DELAYS.FORM_AUTO_SAVE);

    return () => {
      clearTimeout(saveHandler);
    };
  }, [
    title,
    content,
    reflection?.dateCreated,
    reflection?.contentFormat,
    reflections,
    updateReflection,
    addReflection,
  ]);
}
