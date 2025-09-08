import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
// import { userEvent } from "@testing-library/user-event";

import { ReflectionForm } from "./ReflectionForm";
import {
  testReflection,
  testReflections,
} from "../../__mocks__/mockReflections";

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

    fireEvent.change(titleInput, {
      target: { value: "User inputted Reflection" },
    });

    await act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(mockSetReflections).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
