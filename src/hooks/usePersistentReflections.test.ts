import { mockLocalStorage } from "@/__mocks__/mockLocalStorage";
import { renderHook, act, waitFor } from "@testing-library/react";
import { usePersistentReflections } from "./usePersistentReflections";
import { generateMockReflections } from "@/__mocks__/mockReflections";
import type { Reflection } from "@/types/Reflection";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("usePersistentReflections", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loading reflections", () => {
    it("should load reflections from localStorage", () => {
      const mockReflections = generateMockReflections(3);

      localStorage.setItem("reflections", JSON.stringify(mockReflections));

      const { result } = renderHook(() => usePersistentReflections([]));

      act(() => {
        const loadedReflections = result.current.loadReflections();
        expect(loadedReflections).toEqual(mockReflections);
      });
    });

    it("should return an empty array if no reflections are stored", () => {
      const { result } = renderHook(() => usePersistentReflections([]));

      act(() => {
        const loadedReflections = result.current.loadReflections();
        expect(loadedReflections).toEqual([]);
      });
    });

    it("should handle invalid JSON in localStorage gracefully", async () => {
      localStorage.setItem("reflections", "invalid-json");

      const { result } = renderHook(() => usePersistentReflections([]));

      act(() => {
        const loadedReflections = result.current.loadReflections();
        expect(loadedReflections).toEqual([]);
      });
    });

    it("should handle non-array JSON in localStorage gracefully", async () => {
      localStorage.setItem("reflections", JSON.stringify({ not: "an array" }));

      const { result } = renderHook(() => usePersistentReflections([]));

      act(() => {
        const loadedReflections = result.current.loadReflections();
        expect(loadedReflections).toEqual([]);
      });
    });

    it("should handle an error when accessing localStorage", async () => {
      const error = new Error("localStorage access error");

      vi.spyOn(localStorage, "getItem").mockImplementation(() => {
        throw error;
      });

      const { result } = renderHook(() => usePersistentReflections([]));

      act(() => {
        const loadedReflections = result.current.loadReflections();
        expect(loadedReflections).toEqual([]);
      });

      // Error state is set asynchronously, so we need to wait for it
      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("localStorage access error");
      });
    });

    it("should reset timeout if reflections change before debounce completes", async () => {
      const firstReflections = generateMockReflections(1);
      const secondReflections = generateMockReflections(2);

      const { rerender } = renderHook(
        (props: { reflections: Reflection[] }) => usePersistentReflections(props.reflections),
        {
          initialProps: { reflections: firstReflections },
        },
      );

      rerender({ reflections: secondReflections });

      // Wait for debounce to complete and save to localStorage
      await waitFor(
        () => {
          expect(localStorage.getItem("reflections")).toEqual(JSON.stringify(secondReflections));
        },
        { timeout: 1000 },
      );
    });
  });

  describe("saving reflections", () => {
    it("should save reflections to localStorage", async () => {
      const newReflections = generateMockReflections(2);

      const { rerender } = renderHook(
        (props: { reflections: Reflection[] }) => usePersistentReflections(props.reflections),
        {
          initialProps: { reflections: [] as Reflection[] },
        },
      );

      rerender({ reflections: newReflections });

      // Wait for debounce to complete and save to localStorage
      await waitFor(
        () => {
          expect(localStorage.getItem("reflections")).toEqual(JSON.stringify(newReflections));
        },
        { timeout: 1000 },
      );
    });

    it("should handle an error when saving to localStorage", async () => {
      const error = new Error("localStorage save error");

      vi.spyOn(localStorage, "setItem").mockImplementation(() => {
        throw error;
      });

      const newReflections = generateMockReflections(2);

      const { rerender, result } = renderHook(
        (props: { reflections: Reflection[] }) => usePersistentReflections(props.reflections),
        {
          initialProps: { reflections: [] as Reflection[] },
        },
      );

      rerender({ reflections: newReflections });

      // Wait for debounce to complete and error to be set
      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("localStorage save error");
      });
    });
  });
});
