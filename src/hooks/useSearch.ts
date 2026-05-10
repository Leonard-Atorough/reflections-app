import { useCallback, useEffect, useRef, useState, useDeferredValue } from "react";
import type { Reflection } from "../types/Reflection";
import { SEARCH_DEFAULTS } from "@/config/constants";
import { extractPlainText } from "@/types/ContentFormat";

type SearchField = "title" | "content";

interface UseSearchOptions {
  searchFields?: SearchField[];
  debounceMs?: number;
}

export function useSearch(reflections: Reflection[]) {
  const [results, setResults] = useState<Reflection[]>(reflections);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const deferredReflections = useDeferredValue(reflections);

  const search = useCallback(
    (term: string, options?: UseSearchOptions) => {
      const { searchFields = SEARCH_DEFAULTS.FIELDS, debounceMs = SEARCH_DEFAULTS.DEBOUNCE_MS } =
        options || {};

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set debounced search
      debounceTimeoutRef.current = setTimeout(() => {
        if (!term.trim()) {
          setResults(deferredReflections);
          return;
        }

        const lowercaseTerm = term.toLowerCase();
        const filtered = deferredReflections.filter((reflection) => {
          return searchFields.some((field) => {
            const content = field === "title" ? reflection.title : reflection.content;
            let plainText = content;
            if (field === "content") {
              // Strip markdown syntax for search
              plainText = extractPlainText(content, reflection.contentFormat);
            }
            return plainText.toLowerCase().includes(lowercaseTerm);
          });
        });

        setResults(filtered);
      }, debounceMs);
    },
    [deferredReflections],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Reset results when reflections change
  useEffect(() => {
    setResults(reflections);
  }, [reflections]);

  return { results, search };
}
