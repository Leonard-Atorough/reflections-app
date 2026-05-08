import { ReflectionsContext } from "@/contexts";
import type { Reflection } from "@/types/Reflection";
import { useCallback, useContext } from "react";

export function useReflectionActions() {
  const { dispatch, selectedId, reflections } = useContext(ReflectionsContext);

  if (!dispatch) {
    throw new Error("useReflectionActions must be used within a ReflectionsContext.Provider");
  }

  const addReflection = useCallback(
    (reflection: Reflection) => dispatch({ type: "ADD_REFLECTION", payload: reflection }),
    [dispatch],
  );

  const updateReflection = useCallback(
    (reflection: Reflection) => dispatch({ type: "UPDATE_REFLECTION", payload: reflection }),
    [dispatch],
  );

  const deleteReflection = useCallback(
    (id: string) => dispatch({ type: "DELETE_REFLECTION", payload: id }),
    [dispatch],
  );

  const setReflections = useCallback(
    (reflectionsOrFn: Reflection[] | ((prev: Reflection[]) => Reflection[])) => {
      const newReflections =
        typeof reflectionsOrFn === "function" ? reflectionsOrFn(reflections) : reflectionsOrFn;
      dispatch({
        type: "SET_REFLECTIONS",
        payload: newReflections,
      });
    },
    [dispatch, reflections],
  );

  const setSelectedId = useCallback(
    (idOrFn: string | null | ((prev: string | null) => string | null)) => {
      const newId = typeof idOrFn === "function" ? idOrFn(selectedId) : idOrFn;
      dispatch({ type: "SELECT_REFLECTION", payload: newId });
    },
    [dispatch, selectedId],
  );

  return {
    addReflection,
    updateReflection,
    deleteReflection,
    setReflections,
    setSelectedId,
  };
}
