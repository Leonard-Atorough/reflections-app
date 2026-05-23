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
    const reflections = generateMockReflections(3);

    render(<ReflectionsMenuWrapper reflections={reflections} />);

    expect(screen.getByText("Mock Reflection 1")).toBeInTheDocument();
    expect(screen.getByText("Mock Reflection 2")).toBeInTheDocument();
    expect(screen.getByText("Mock Reflection 3")).toBeInTheDocument();
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
