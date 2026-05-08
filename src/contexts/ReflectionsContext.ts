import React from "react";
import type { Reflection } from "../types/Reflection";
import type { ReflectionsAction } from "../reducers/reflectionsReducer";

export interface ReflectionsContextType {
  reflections: Reflection[];
  selectedId: string | null;
  dispatch: React.Dispatch<ReflectionsAction>;
}

export const ReflectionsContext = React.createContext<ReflectionsContextType>({
  reflections: [],
  selectedId: null,
  dispatch: () => {},
});
