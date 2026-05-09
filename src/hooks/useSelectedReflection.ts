import { useContext, useMemo } from "react";
import { ReflectionsContext } from "../contexts";

export function useSelectedReflection() {
  const context = useContext(ReflectionsContext);
  if (!context) {
    throw new Error("useSelectedReflection must be used within a ReflectionsContext");
  }
  const { reflections, selectedId } = context;
  const selectedReflection = reflections.find((reflection) => reflection.id === selectedId) || null;
  return useMemo(() => selectedReflection, [selectedReflection]);
}
