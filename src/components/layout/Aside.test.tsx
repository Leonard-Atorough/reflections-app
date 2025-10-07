import { Aside } from "./Aside";

import { render, screen } from "@testing-library/react";

import type { Reflection } from "../../types/Reflection";

const testReflections: Reflection[] = [
  {
    id: "test1",
    title: "Test Reflection 1",
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    content: "This is a test reflection, let it not be a deflection.",
  },
];
const selectedId = "test1";
const onSelect = vi.fn();
const isEditing = false;
const setIsEditing = vi.fn();

describe("Sidebar component", () => {
  it("Renders a sidebar component with a header, button and a list with passed in reflection props", () => {
    render(
      <Aside
        reflections={testReflections}
        selectedId={selectedId}
        onSelect={onSelect}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    );

    expect(screen.getByText("Reflections")).toBeInTheDocument();
    expect(screen.getByText("Test Reflection 1")).toBeInTheDocument();
  });
});
