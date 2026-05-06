import React from "react";
import type { Reflection } from "../types/Reflection";

export interface ReflectionsContextType {
    reflections: Reflection[];
    setReflections: React.Dispatch<React.SetStateAction<Reflection[]>>;
    selectedId: string | null;
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;

}

export const ReflectionsContext = React.createContext<ReflectionsContextType>({
    reflections: [],
    setReflections: () => { },
    selectedId: null,
    setSelectedId: () => { },
});