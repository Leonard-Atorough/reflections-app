import { act, renderHook } from "@testing-library/react";
import { useFormAutoSave } from "./useFormAutoSave";
import type { Reflection } from "../types/Reflection";
import * as useReflectionActionsModule from "./useReflectionActions";

vi.mock("./useReflectionActions");

describe("useFormAutoSave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("calls addReflection when new reflection is created with title", () => {
    const mockAddReflection = vi.fn();
    const mockUpdateReflection = vi.fn();

    vi.spyOn(useReflectionActionsModule, "useReflectionActions").mockReturnValue({
      addReflection: mockAddReflection,
      updateReflection: mockUpdateReflection,
    } as never);

    const reflections: Reflection[] = [];

    renderHook(() =>
      useFormAutoSave({
        title: "New Reflection",
        content: "",
        reflections,
        reflection: null,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockAddReflection).toHaveBeenCalledTimes(1);
    const saved = mockAddReflection.mock.calls[0][0];
    expect(saved.title).toBe("New Reflection");
    expect(saved.content).toBe("");
  });

  it("calls updateReflection when existing reflection is modified", () => {
    const mockAddReflection = vi.fn();
    const mockUpdateReflection = vi.fn();

    vi.spyOn(useReflectionActionsModule, "useReflectionActions").mockReturnValue({
      addReflection: mockAddReflection,
      updateReflection: mockUpdateReflection,
    } as never);

    const existingReflection: Reflection = {
      id: "123",
      title: "Old Title",
      content: "Content",
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      contentFormat: "plaintext",
    };
    const reflections = [existingReflection];

    renderHook(() =>
      useFormAutoSave({
        title: "New Title",
        content: "Content",
        reflections,
        reflection: existingReflection,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockUpdateReflection).toHaveBeenCalledTimes(1);
    const saved = mockUpdateReflection.mock.calls[0][0];
    expect(saved.id).toBe("123");
    expect(saved.title).toBe("New Title");
  });

  it("does not save if title is only whitespace", () => {
    const mockAddReflection = vi.fn();
    const mockUpdateReflection = vi.fn();

    vi.spyOn(useReflectionActionsModule, "useReflectionActions").mockReturnValue({
      addReflection: mockAddReflection,
      updateReflection: mockUpdateReflection,
    } as never);

    renderHook(() =>
      useFormAutoSave({
        title: "   ",
        content: "Some content",
        reflections: [],
        reflection: null,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockAddReflection).not.toHaveBeenCalled();
    expect(mockUpdateReflection).not.toHaveBeenCalled();
  });

  it("does not save if reflection hasn't changed", () => {
    const mockAddReflection = vi.fn();
    const mockUpdateReflection = vi.fn();

    vi.spyOn(useReflectionActionsModule, "useReflectionActions").mockReturnValue({
      addReflection: mockAddReflection,
      updateReflection: mockUpdateReflection,
    } as never);

    const existingReflection: Reflection = {
      id: "123",
      title: "Title",
      content: "Content",
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      contentFormat: "plaintext",
    };
    const reflections = [existingReflection];

    renderHook(() =>
      useFormAutoSave({
        title: "Title",
        content: "Content",
        reflections,
        reflection: existingReflection,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockAddReflection).not.toHaveBeenCalled();
    expect(mockUpdateReflection).not.toHaveBeenCalled();
  });

  it("debounces multiple rapid changes", () => {
    const mockAddReflection = vi.fn();
    const mockUpdateReflection = vi.fn();

    vi.spyOn(useReflectionActionsModule, "useReflectionActions").mockReturnValue({
      addReflection: mockAddReflection,
      updateReflection: mockUpdateReflection,
    } as never);

    let title = "T";
    const { rerender } = renderHook(
      ({ currentTitle }) =>
        useFormAutoSave({
          title: currentTitle,
          content: "",
          reflections: [],
          reflection: null,
        }),
      { initialProps: { currentTitle: title } },
    );

    // Simulate rapid typing
    for (let i = 0; i < 5; i++) {
      title += "e";
      rerender({ currentTitle: title });
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }

    expect(mockAddReflection).not.toHaveBeenCalled();

    // Advance to debounce time
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Should only be called once with final state
    expect(mockAddReflection).toHaveBeenCalledTimes(1);
    expect(mockAddReflection.mock.calls[0][0].title).toBe("Teeeee");
  });

  it("generates new ID for new reflections", () => {
    const mockAddReflection = vi.fn();
    const mockUpdateReflection = vi.fn();

    vi.spyOn(useReflectionActionsModule, "useReflectionActions").mockReturnValue({
      addReflection: mockAddReflection,
      updateReflection: mockUpdateReflection,
    } as never);

    renderHook(() =>
      useFormAutoSave({
        title: "New",
        content: "",
        reflections: [],
        reflection: null,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockAddReflection).toHaveBeenCalledTimes(1);
    const saved = mockAddReflection.mock.calls[0][0];
    // Should have a valid UUID (36 chars with dashes)
    expect(saved.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
