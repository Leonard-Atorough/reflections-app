import { useEffect, useRef, useState } from "react";
import type { Reflection } from "../types/Reflection";

type SearchField = "title" | "content";

interface UseSearchOptions {
  searchFields?: SearchField[];
  debounceMs?: number;
}

export function useSearch(reflections: Reflection[]) {
  const [results, setResults] = useState<Reflection[]>(reflections);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const search = (term: string, options?: UseSearchOptions) => {
    const { searchFields = ["title"], debounceMs = 500 } = options || {};

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      if (!term.trim()) {
        setResults(reflections);
        return;
      }

      const lowercaseTerm = term.toLowerCase();
      const filtered = reflections.filter((reflection) => {
        return searchFields.some((field) => {
          const content = field === "title" ? reflection.title : reflection.content;
          return content.toLowerCase().includes(lowercaseTerm);
        });
      });

      setResults(filtered);
    }, debounceMs);
  };

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
