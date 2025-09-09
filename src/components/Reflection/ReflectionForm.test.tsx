import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
// import { userEvent } from "@testing-library/user-event";

import { ReflectionForm } from "./ReflectionForm";
import {
  testReflection,
  testReflections,
} from "../../__mocks__/mockReflections";
import { mockReflections } from "../../data/mockReflections";
import userEvent from "@testing-library/user-event";

describe("ReflectionForm", () => {
  it("renders correctly when a reflection is passed in", () => {
    const mockSetReflections = vi.fn();
    render(
      <ReflectionForm
        reflection={testReflection}
        setReflections={mockSetReflections}
      />
    );

    expect(screen.getByDisplayValue(testReflection.title)).toBeInTheDocument();
    expect(screen.getByText(testReflection.content)).toBeInTheDocument();
  });

  it("renders Empty form when Reflection is null", () => {
    const mockSetReflections = vi.fn();
    render(
      <ReflectionForm reflection={null} setReflections={mockSetReflections} />
    );
    const titleInput = screen.getByRole("textbox", { name: /title/i });
    const contentArea = screen.getByRole("textbox", { name: /content/i });

    expect(titleInput).toHaveValue("");
    expect(contentArea).toHaveValue("");
  });

  it("calls setReflections and adds a new reflection when title is updated", async () => {
    vi.useFakeTimers();
    const mockSetReflections = vi.fn();

    render(
      <ReflectionForm reflection={null} setReflections={mockSetReflections} />
    );

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    // While this would be ideal, it relies on real timers which conflicts with the vitest fake timer
    // await userEvent.type(titleInput, "User inputted Reflection");

    await act(() => {
      fireEvent.change(titleInput, {
        target: { value: "User inputted Reflection" },
      });
    });

    await act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockSetReflections).toHaveBeenCalledTimes(1);
    const updaterFn = mockSetReflections.mock.calls[0][0];
    //TODO: Fully understand this line and what its doing
    const result = updaterFn([]);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("User inputted Reflection");
    expect(result[0].content).toBe("");

    vi.useRealTimers();
  });

  it("calls setReflections and updates reflection when title is changed", async () => {
    vi.useFakeTimers();
    const mockSetReflections = vi.fn();

    render(
      <ReflectionForm
        reflection={testReflection}
        setReflections={mockSetReflections}
      />
    );

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const titleInput = screen.getByRole("textbox", { name: /title/i });

    await user.clear(titleInput);
    await user.type(titleInput, "New reflection title");

    await act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockSetReflections).toHaveBeenCalledTimes(1);
    const updaterFn = mockSetReflections.mock.calls[0][0];
    //TODO: Fully understand this line and what its doing
    const result = updaterFn([testReflection]);
    
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("User inputted Reflection");
    expect(result[0].content).toBe("");

    vi.useRealTimers();
  });
});
