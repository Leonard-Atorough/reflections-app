import { useCallback, useEffect, useRef, useState } from "react";
import type { Reflection } from "../types/Reflection";
import { DEBOUNCE_DELAYS, STORAGE_KEYS } from "@/config/constants";

const DEBOUNCE_MS = DEBOUNCE_DELAYS.STORAGE_PERSIST;

export interface UsePersistentReflectionsResult {
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
  loadReflections: () => Reflection[];
}

export interface UsePersistentReflectionsOptions {
  autoSave?: boolean;
}

export function usePersistentReflections(
  reflections: Reflection[],
  options?: UsePersistentReflectionsOptions,
): UsePersistentReflectionsResult {
  const { autoSave = true } = options || {};
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const saveReflections = (reflectionsToSave: Reflection[]) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsSaving(true);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(reflectionsToSave));
        setError(null);
      } catch (err) {
        console.error("Error saving reflections:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsSaving(false);
      }
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    if (autoSave && reflections.length > 0) {
      saveReflections(reflections);
    }
  }, [reflections, autoSave]);

  const loadReflections = useCallback((): Reflection[] => {
    setIsLoading(true);
    try {
      const storedReflections = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
      if (storedReflections) {
        const parsed = JSON.parse(storedReflections) as unknown;
        const reflections = Array.isArray(parsed) ? parsed : [];
        setError(null);
        return reflections;
      }
      return [];
    } catch (err) {
      console.error("Error loading reflections:", err);
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, isSaving, error, loadReflections };
}
