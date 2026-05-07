import { Aside } from "./Aside";

import { render, screen } from "@testing-library/react";

import type { Reflection } from "../types/Reflection";
import { UIContext } from "../contexts/UIContext";
import { ReflectionsContext } from "../contexts/ReflectionsContext";

const testReflections: Reflection[] = [
  {
    id: "test1",
    title: "Test Reflection 1",
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    content: "This is a test reflection, let it not be a deflection.",
  },
];

describe("Sidebar component", () => {
  it("Renders a sidebar component with a header, button and a list with passed in reflection props", () => {
    render(
      <UIContext
        value={{
          isEditing: false,
          setIsEditing: vi.fn(),
          sidebarVisible: true,
          setSidebarVisible: vi.fn(),
        }}
      >
        <ReflectionsContext
          value={{
            reflections: testReflections,
            setReflections: vi.fn(),
            selectedId: "test1",
            setSelectedId: vi.fn(),
          }}
        >
          <Aside />
        </ReflectionsContext>
      </UIContext>,
    );

    expect(screen.getByText("Test Reflection 1")).toBeInTheDocument();
  });
});
