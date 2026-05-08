import { generateMockReflections } from "@/__mocks__/mockReflections";
import { renderHook } from "@testing-library/react";
import { useSelectedReflection } from "./useSelectedReflection";
import { createContextWrapper } from "@/test/contextWrappers";

describe("useSelectedReflection", () => {
  it("should return the selected reflection based on selectedId", () => {
    const mockReflections = generateMockReflections(3);
    const selectedId = mockReflections[1].id;

    // createContextWrapper accepts an options object to customize context values
    const wrapper = createContextWrapper({
      reflections: mockReflections,
      selectedId,
    });

    const { result } = renderHook(() => useSelectedReflection(), { wrapper });

    expect(result.current).toEqual(mockReflections[1]);
  });

  it("should return null if no reflection is selected", () => {
    const mockReflections = generateMockReflections(3);

    const wrapper = createContextWrapper({
      reflections: mockReflections,
      selectedId: null,
    });
    const { result } = renderHook(() => useSelectedReflection(), { wrapper });

    expect(result.current).toBeNull();
  });

  it("should return null if selectedId does not match any reflection", () => {
    const mockReflections = generateMockReflections(3);
    const wrapper = createContextWrapper({
      reflections: mockReflections,
      selectedId: "non-existent-id",
    });
    const { result } = renderHook(() => useSelectedReflection(), { wrapper });

    expect(result.current).toBeNull();
  });

  it("should update the selected reflection when selectedId changes", () => {
    const mockReflections = generateMockReflections(3);

    // First hook with first reflection selected
    const wrapper1 = createContextWrapper({
      reflections: mockReflections,
      selectedId: mockReflections[0].id,
    });
    const { result: result1 } = renderHook(() => useSelectedReflection(), { wrapper: wrapper1 });
    expect(result1.current).toEqual(mockReflections[0]);

    // Second hook with third reflection selected
    const wrapper2 = createContextWrapper({
      reflections: mockReflections,
      selectedId: mockReflections[2].id,
    });
    const { result: result2 } = renderHook(() => useSelectedReflection(), { wrapper: wrapper2 });
    expect(result2.current).toEqual(mockReflections[2]);
  });
});
