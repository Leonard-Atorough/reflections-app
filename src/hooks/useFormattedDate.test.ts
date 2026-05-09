import { renderHook } from "@testing-library/react";
import { useFormattedDate } from "./useFormattedDate";

// Note: We only need a basic test to ensure the hook is working
describe("useFormattedDate", () => {
  it("formats a date string correctly", () => {
    const { result } = renderHook(() => useFormattedDate("2024-01-01T00:00:00Z"));
    expect(result.current).toBe("January 01, 2024 - 0:00");
  });
});
