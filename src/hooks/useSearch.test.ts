import { renderHook, waitFor } from "@testing-library/react";
import { useSearch } from "./useSearch";
import { testReflection } from "../__mocks__/mockReflections";

describe("useSearch", () => {
  const mockReflections = [
    testReflection,
    {
      ...testReflection,
      id: "test-id-002",
      title: "Another Title",
      content: "Different content here",
    },
    {
      ...testReflection,
      id: "test-id-003",
      title: "Third Reflection",
      content: "Test Reflection Title content",
    },
  ];

  it("returns all reflections by default", () => {
    const { result } = renderHook(() => useSearch(mockReflections));
    expect(result.current.results).toEqual(mockReflections);
  });

  it("filters reflections by title", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    result.current.search("Another", { searchFields: ["title"], debounceMs: 0 });

    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].title).toBe("Another Title");
    });
  });

  it("filters reflections by content", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    result.current.search("Different", { searchFields: ["content"], debounceMs: 0 });

    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].content).toContain("Different");
    });
  });

  it("filters by both title and content", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    result.current.search("Test", {
      searchFields: ["title", "content"],
      debounceMs: 0,
    });

    await waitFor(() => {
      expect(result.current.results).toHaveLength(2);
    });
  });

  it("returns all reflections when search term is empty", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    result.current.search("", { debounceMs: 0 });

    await waitFor(() => {
      expect(result.current.results).toEqual(mockReflections);
    });
  });

  it("is case-insensitive", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    result.current.search("ANOTHER", { searchFields: ["title"], debounceMs: 0 });

    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].title).toBe("Another Title");
    });
  });

  it("respects debounce setting", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    result.current.search("Another", { searchFields: ["title"], debounceMs: 100 });
    expect(result.current.results).toEqual(mockReflections);

    await waitFor(
      () => {
        expect(result.current.results).toHaveLength(1);
      },
      { timeout: 200 },
    );
  });
});
