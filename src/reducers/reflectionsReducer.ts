import type { Reflection } from "../types/Reflection";

export interface ReflectionsState {
  reflections: Reflection[];
  selectedId: string | null;
}

export type ReflectionsAction =
  | { type: "SET_REFLECTIONS"; payload: Reflection[] }
  | { type: "SELECT_REFLECTION"; payload: string | null }
  | { type: "ADD_REFLECTION"; payload: Reflection }
  | { type: "UPDATE_REFLECTION"; payload: Reflection }
  | { type: "DELETE_REFLECTION"; payload: string };

export function reflectionsReducer(
  state: ReflectionsState,
  action: ReflectionsAction,
): ReflectionsState {
  switch (action.type) {
    case "SET_REFLECTIONS":
      return { ...state, reflections: action.payload };

    case "SELECT_REFLECTION":
      return { ...state, selectedId: action.payload };

    case "ADD_REFLECTION":
      return {
        ...state,
        reflections: [...state.reflections, action.payload],
      };

    case "UPDATE_REFLECTION":
      return {
        ...state,
        reflections: state.reflections.map((r) =>
          r.id === action.payload.id ? action.payload : r,
        ),
      };

    case "DELETE_REFLECTION":
      return {
        ...state,
        reflections: state.reflections.filter((r) => r.id !== action.payload),
        selectedId:
          state.selectedId === action.payload
            ? (state.reflections.at(-1)?.id ?? null)
            : state.selectedId,
      };

    default:
      return state;
  }
}
