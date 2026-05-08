import { useContext, useMemo } from "react";
import { ReflectionsContext } from "../contexts";

export function useSelectedReflection() {
  const { reflections, selectedId } = useContext(ReflectionsContext);
  const selectedReflection = reflections.find((reflection) => reflection.id === selectedId) || null;
  return useMemo(() => selectedReflection, [selectedReflection]);
}
