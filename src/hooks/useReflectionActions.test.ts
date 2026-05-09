import { generateMockReflections } from "@/__mocks__/mockReflections";
import { createContextWrapper } from "@/test/contextWrappers";
import { useReflectionActions } from ".";
import { renderHook } from "@testing-library/react";
import type { Reflection } from "@/types/Reflection";

describe("useReflectionActions", () => {
  describe("addReflection", () => {
    it("should dispatch ADD_REFLECTION action with the correct payload", () => {
      const mockReflection = generateMockReflections(1)[0];
      const dispatch = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch,
      });

      const { result } = renderHook(() => useReflectionActions(), { wrapper });
      result.current.addReflection(mockReflection);

      expect(dispatch).toHaveBeenCalledWith({
        type: "ADD_REFLECTION",
        payload: mockReflection,
      });
    });

    it("should dispatch ADD_REFLECTION action with a generated id if not provided", () => {
      const mockReflection = { ...generateMockReflections(1)[0], id: undefined };
      const dispatch = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch,
      });

      const { result } = renderHook(() => useReflectionActions(), { wrapper });
      result.current.addReflection(mockReflection as unknown as Reflection);

      expect(dispatch).toHaveBeenCalledWith({
        type: "ADD_REFLECTION",
        payload: expect.objectContaining({
          ...mockReflection,
          id: undefined,
        }),
      });
    });
  });

  describe("updateReflection", () => {
    it("should dispatch UPDATE_REFLECTION action with the correct payload", () => {
      const mockReflection = generateMockReflections(1)[0];
      const updatedReflection = { ...mockReflection, title: "Updated Title" };
      const dispatch = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [mockReflection],
        selectedId: mockReflection.id,
        dispatch,
      });

      const { result } = renderHook(() => useReflectionActions(), { wrapper });
      result.current.updateReflection(updatedReflection);

      expect(dispatch).toHaveBeenCalledWith({
        type: "UPDATE_REFLECTION",
        payload: updatedReflection,
      });
    });
  });

  describe("deleteReflection", () => {
    it("should dispatch DELETE_REFLECTION action with the correct payload", () => {
      const mockReflection = generateMockReflections(1)[0];
      const dispatch = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [mockReflection],
        selectedId: mockReflection.id,
        dispatch,
      });

      const { result } = renderHook(() => useReflectionActions(), { wrapper });
      result.current.deleteReflection(mockReflection.id);

      expect(dispatch).toHaveBeenCalledWith({
        type: "DELETE_REFLECTION",
        payload: mockReflection.id,
      });
    });
  });

  describe("setReflections", () => {
    it("should dispatch SET_REFLECTIONS action with the correct payload when given an array", () => {
      const mockReflections = generateMockReflections(3);
      const dispatch = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch,
      });

      const { result } = renderHook(() => useReflectionActions(), { wrapper });
      result.current.setReflections(mockReflections);

      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_REFLECTIONS",
        payload: mockReflections,
      });
    });

    it("should dispatch SET_REFLECTIONS action with the correct payload when given a function", () => {
      const mockReflections = generateMockReflections(3);
      const additionalReflection = generateMockReflections(1)[0];
      const dispatch = vi.fn();
      const wrapper = createContextWrapper({
        reflections: mockReflections,
        selectedId: null,
        dispatch,
      });

      const { result } = renderHook(() => useReflectionActions(), { wrapper });
      result.current.setReflections((prev) => [...prev, additionalReflection]);

      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_REFLECTIONS",
        payload: [...mockReflections, additionalReflection],
      });
    });
  });

  describe("setSelectedId", () => {
    it("should dispatch SELECT_REFLECTION action with the correct payload when given an id", () => {
      const mockReflection = generateMockReflections(1)[0];
      const dispatch = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [mockReflection],
        selectedId: null,
        dispatch,
      });

      const { result } = renderHook(() => useReflectionActions(), { wrapper });
      result.current.setSelectedId(mockReflection.id);

      expect(dispatch).toHaveBeenCalledWith({
        type: "SELECT_REFLECTION",
        payload: mockReflection.id,
      });
    });
    it("should dispatch SELECT_REFLECTION action with the correct payload when given a function", () => {
      const mockReflection1 = generateMockReflections(1)[0];
      const mockReflection2 = generateMockReflections(1)[0];
      const dispatch = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [mockReflection1, mockReflection2],
        selectedId: mockReflection1.id,
        dispatch,
      });

      const { result } = renderHook(() => useReflectionActions(), { wrapper });
      result.current.setSelectedId((prev) =>
        prev === mockReflection1.id ? mockReflection2.id : mockReflection1.id,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: "SELECT_REFLECTION",
        payload: mockReflection2.id,
      });
    });
  });

  describe("error handling", () => {
    it("should throw an error if used outside of ReflectionsContext", () => {
      expect(() => renderHook(() => useReflectionActions())).toThrow(
        "useReflectionActions must be used within a ReflectionsContext.Provider",
      );
    });
  });
});
