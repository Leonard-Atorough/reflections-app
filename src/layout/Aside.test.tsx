import { Aside } from "./Aside";
import { render, screen } from "@testing-library/react";
import type { Reflection } from "../types/Reflection";
import { ReflectionsContext, EditingContext } from "../contexts";

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
      <EditingContext
        value={{
          isEditing: false,
          setIsEditing: vi.fn(),
        }}
      >
        <ReflectionsContext
          value={{
            reflections: testReflections,
            selectedId: "test1",
            dispatch: vi.fn(),
          }}
        >
          <Aside />
        </ReflectionsContext>
      </EditingContext>,
    );

    expect(screen.getByText("Test Reflection 1")).toBeInTheDocument();
  });
});
