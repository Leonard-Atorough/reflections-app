import { renderHook, waitFor } from "@testing-library/react";
import { useSearch } from "./useSearch";
import { generateMockReflections } from "../__mocks__/mockReflections";

describe("useSearch", () => {
  const mockReflections = generateMockReflections(3);

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

  it("returns all reflections when search term is only whitespace", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    result.current.search("   ", { debounceMs: 0 });

    await waitFor(() => {
      expect(result.current.results).toEqual(mockReflections);
    });
  });

  it("uses default search options when none provided", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    // Search should use SEARCH_DEFAULTS.FIELDS (["title"]) and SEARCH_DEFAULTS.DEBOUNCE_MS
    result.current.search("Another", { debounceMs: 0 });

    await waitFor(() => {
      // Should find the result in title field
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].title).toBe("Another Title");
    });
  });

  it("returns empty results when no matches found", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    result.current.search("NonexistentTerm", {
      searchFields: ["title", "content"],
      debounceMs: 0,
    });

    await waitFor(() => {
      expect(result.current.results).toHaveLength(0);
    });
  });

  it("resets results when reflections prop changes", async () => {
    const { result, rerender } = renderHook(({ reflections }) => useSearch(reflections), {
      initialProps: { reflections: mockReflections },
    });

    // Perform a search
    result.current.search("Another", { searchFields: ["title"], debounceMs: 0 });

    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
    });

    // Change the reflections array
    const newReflections = [
      {
        ...generateMockReflections(1)[0],
        id: "test-id-new",
        title: "New Reflection",
      },
    ];

    rerender({ reflections: newReflections });

    // Results should reset to the new reflections array
    await waitFor(() => {
      expect(result.current.results).toEqual(newReflections);
    });
  });

  it("handles empty reflections array", () => {
    const { result } = renderHook(() => useSearch([]));
    expect(result.current.results).toEqual([]);
  });

  it("cancels previous search when new search is initiated", async () => {
    const { result } = renderHook(() => useSearch(mockReflections));

    // Initiate first search with debounce
    result.current.search("Another", { searchFields: ["title"], debounceMs: 100 });

    // Immediately initiate second search with debounce
    result.current.search("Third", { searchFields: ["title"], debounceMs: 0 });

    // Wait for the second search to complete
    await waitFor(() => {
      // Should only have results from the second search
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].title).toBe("Third Reflection");
    });
  });
});
