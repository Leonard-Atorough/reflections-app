import { generateMockReflections } from "@/__mocks__/mockReflections";
import {
  reflectionsReducer,
  type ReflectionsAction,
  type ReflectionsState,
} from "./reflectionsReducer";

describe("reflectionsReducer", () => {
  it("should return the initial state when an unknown action is dispatched", () => {
    const initialState = { reflections: [], selectedId: null };
    const action = { type: "UNKNOWN_ACTION" } as never;
    const newState = reflectionsReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });

  it("should set reflections when SET_REFLECTIONS action is dispatched", () => {
    const initialState = { reflections: [], selectedId: null };
    const mockReflections = [
      {
        id: "1",
        title: "Reflection 1",
        content: "Content 1",
        dateCreated: new Date("2024-01-01T00:00:00Z").getTime(),
        dateUpdated: new Date("2024-01-01T00:00:00Z").getTime(),
      },
      {
        id: "2",
        title: "Reflection 2",
        content: "Content 2",
        dateCreated: new Date("2024-01-02T00:00:00Z").getTime(),
        dateUpdated: new Date("2024-01-02T00:00:00Z").getTime(),
      },
    ];
    const action = { type: "SET_REFLECTIONS", payload: mockReflections };
    const newState = reflectionsReducer(initialState, action as unknown as ReflectionsAction);
    expect(newState.reflections).toEqual(mockReflections);
  });

  it("should select a reflection when SELECT_REFLECTION action is dispatched", () => {
    const initialState = { reflections: [], selectedId: null };
    const action = { type: "SELECT_REFLECTION", payload: "1" };
    const newState = reflectionsReducer(initialState, action as unknown as ReflectionsAction);
    expect(newState.selectedId).toBe("1");
  });

  it("should add a reflection when ADD_REFLECTION action is dispatched", () => {
    const initialState = { reflections: [], selectedId: null };
    const newReflection = {
      id: "1",
      title: "New Reflection",
      content: "New Content",
      dateCreated: new Date("2024-01-03T00:00:00Z").getTime(),
      dateUpdated: new Date("2024-01-03T00:00:00Z").getTime(),
    };
    const action = { type: "ADD_REFLECTION", payload: newReflection };
    const newState = reflectionsReducer(initialState, action as unknown as ReflectionsAction);
    expect(newState.reflections).toContainEqual(newReflection);
  });

  it("should update a reflection when UPDATE_REFLECTION action is dispatched", () => {
    const initialState: ReflectionsState = {
      reflections: generateMockReflections(1),
      selectedId: null,
    };
    const updatedReflection = {
      id: "1",
      title: "Updated Title",
      content: "Updated Content",
      dateCreated: new Date("2024-01-01T00:00:00Z").getTime(),
      dateUpdated: new Date("2024-01-02T00:00:00Z").getTime(),
      contentFormat: "plaintext",
    };
    const action = { type: "UPDATE_REFLECTION", payload: updatedReflection };
    const newState = reflectionsReducer(initialState, action as unknown as ReflectionsAction);
    expect(newState.reflections).toContainEqual(updatedReflection);
  });

  it("should delete a reflection when DELETE_REFLECTION action is dispatched", () => {
    const initialState: ReflectionsState = {
      reflections: generateMockReflections(2),
      selectedId: "1",
    };
    const action = { type: "DELETE_REFLECTION", payload: "1" };
    const newState = reflectionsReducer(initialState, action as unknown as ReflectionsAction);

    expect(newState.reflections).toHaveLength(1);
    expect(newState.reflections[0].id).toBe("2");
    expect(newState.selectedId).toBeNull();
  });

  it("should delete a reflection and not update selectedId if the deleted reflection is not selected", () => {
    const initialState: ReflectionsState = {
      reflections: generateMockReflections(2),
      selectedId: "1",
    };
    const action = { type: "DELETE_REFLECTION", payload: "2" };
    const newState = reflectionsReducer(initialState, action as unknown as ReflectionsAction);
    expect(newState.reflections).toHaveLength(1);
    expect(newState.reflections[0].id).toBe("1");
    expect(newState.selectedId).toBe("1");
  });
});
