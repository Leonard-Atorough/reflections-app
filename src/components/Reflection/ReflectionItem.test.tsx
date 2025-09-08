import React, { useState } from "react";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import type { Reflection } from "../../types/Reflection";
import { ReflectionItem } from "./ReflectionItem";
import styles from "./ReflectionItem.module.css";

const testReflection: Reflection = {
  id: "test1",
  title: "First Test Reflection",
  dateCreated: "2025-09-01T09:15:00.000Z",
  dateUpdated: "2025-09-01T09:15:00.000Z",
  content:
    "This is test content meant to be used to simulate the content of a reflection item",
};

function ReflectionItemWrapper() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isSelected = selectedId === testReflection.id;

  return (
    <>
      <ReflectionItem
        reflection={testReflection}
        onSelect={(id) => setSelectedId(id)}
        isSelected={isSelected}
      />
    </>
  );
}

describe("ReflectionItem", () => {
  it("renders the reflecion item correctly", () => {
    render(
      <ReflectionItem
        reflection={testReflection}
        onSelect={() => {}}
        isSelected={false}
      />
    );
    expect(screen.getByText("First Test Reflection")).toBeInTheDocument();
    expect(screen.getByText("2025-09-01T09:15:00.000Z")).toBeInTheDocument();
  });

  it("calls onSelect with reflectionId when clicked once", async () => {
    const setSelectedId = vi.fn();
    render(
      <ReflectionItem
        reflection={testReflection}
        onSelect={setSelectedId}
        isSelected={false}
      />
    );
    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);

    expect(setSelectedId).toHaveBeenCalledWith("test1");
    expect(setSelectedId).toHaveBeenCalledOnce();
  });

  it("calls onSelect with reflectionId when enter is pressed", async () => {
    const setSelectedId = vi.fn();
    render(
      <ReflectionItem
        reflection={testReflection}
        onSelect={setSelectedId}
        isSelected={false}
      />
    );
    const item = screen.getByTestId("reflection-button");
    item.focus();
    await userEvent.keyboard("{enter}");

    expect(setSelectedId).toHaveBeenCalledWith("test1");
    expect(setSelectedId).toHaveBeenCalledOnce();
  });

  it("adds the selected style to the list element when selected", () => {
    render(
      <ReflectionItem
        reflection={testReflection}
        onSelect={() => {}}
        isSelected={true}
      />
    );

    expect(screen.getByTestId("reflection-button")).toHaveClass(
      styles.selected
    );
  });

  it("calls onSelect with null when clicked twice", async () => {
    render(<ReflectionItemWrapper />);
    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);
    expect(item).toHaveClass(styles.selected);

    await userEvent.click(item);
    expect(item).not.toHaveClass(styles.selected);
  });
});
