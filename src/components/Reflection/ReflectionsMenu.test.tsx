import { cleanup, render, screen } from "@testing-library/react";
import { ReflectionsMenu } from "./ReflectionsMenu/ReflectionsMenu";
import { generateMockReflections } from "../../__mocks__/mockReflections";
import { EditingContext } from "../../contexts/EditingContext";
import { ReflectionsContext } from "../../contexts/ReflectionsContext";

describe("ReflectionsMenu", () => {
  function ReflectionsMenuWrapper({ reflections = [generateMockReflections(1)[0]] }) {
    return (
      <EditingContext
        value={{
          isEditing: false,
          setIsEditing: vi.fn(),
        }}
      >
        <ReflectionsContext
          value={{
            reflections,
            selectedId: null,
            dispatch: vi.fn(),
          }}
        >
          <ReflectionsMenu reflections={reflections} />
        </ReflectionsContext>
      </EditingContext>
    );
  }

  afterEach(() => {
    cleanup();
  });

  it("renders all reflections", () => {
    const reflections = [
      generateMockReflections(1)[0],
      { ...generateMockReflections(1)[0], id: "test-id-002", title: "Second Reflection" },
      { ...generateMockReflections(1)[0], id: "test-id-003", title: "Third Reflection" },
    ];

    render(<ReflectionsMenuWrapper reflections={reflections} />);

    expect(screen.getByText("Test Reflection Title")).toBeInTheDocument();
    expect(screen.getByText("Second Reflection")).toBeInTheDocument();
    expect(screen.getByText("Third Reflection")).toBeInTheDocument();
  });

  it("renders empty list when no reflections provided", () => {
    render(<ReflectionsMenuWrapper reflections={[]} />);

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    expect(listbox).toHaveAttribute("aria-label", "Reflections List");
  });

  it("has proper accessibility attributes", () => {
    render(<ReflectionsMenuWrapper />);

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("aria-label", "Reflections List");
  });
});
