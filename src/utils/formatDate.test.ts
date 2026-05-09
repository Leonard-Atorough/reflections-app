import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("should format a date string to 'Month Day, Year - HH:MM'", () => {
    const input = "2024-06-15T12:00:00Z";
    const expectedOutput = "June 15, 2024 - 13:00";
    expect(formatDate(input)).toBe(expectedOutput);
  });

  it("should format a Date object to 'Month Day, Year - HH:MM'", () => {
    const input = new Date("2024-06-15T12:00:00Z");
    const expectedOutput = "June 15, 2024 - 13:00";
    expect(formatDate(input)).toBe(expectedOutput);
  });

  it("should format a timestamp to 'Month Day, Year - HH:MM'", () => {
    const input = new Date("2024-06-15T12:00:00Z").getTime();
    const expectedOutput = "June 15, 2024 - 13:00";
    expect(formatDate(input)).toBe(expectedOutput);
  });

  it("should throw an error for invalid date input", () => {
    const input = "invalid-date";
    expect(() => formatDate(input)).toThrow("Invalid date supplied to 'formatDate()' function");
  });

  it("should return today's date in the correct format when no input is provided", () => {
    // Mock the current date using fake timers
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));

    const expectedOutput = "Saturday - 13:00";
    expect(formatDate("")).toBe(expectedOutput);

    vi.useRealTimers();
  });
});
