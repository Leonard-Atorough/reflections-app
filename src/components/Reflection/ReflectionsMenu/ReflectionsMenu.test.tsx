import { cleanup, render, screen } from "@testing-library/react";
import { ReflectionsMenu } from "./ReflectionsMenu";
import { testReflection } from "../../../__mocks__/mockReflections";
import { UIContext } from "../../../contexts/UIContext";
import { ReflectionsContext } from "../../../contexts/ReflectionsContext";

describe("ReflectionsMenu", () => {
  function ReflectionsMenuWrapper({ reflections = [testReflection] }) {
    return (
      <UIContext
        value={{
          isEditing: false,
          setIsEditing: vi.fn(),
          sidebarVisible: false,
          setSidebarVisible: vi.fn(),
        }}
      >
        <ReflectionsContext
          value={{
            reflections,
            setReflections: vi.fn(),
            selectedId: null,
            setSelectedId: vi.fn(),
          }}
        >
          <ReflectionsMenu reflections={reflections} />
        </ReflectionsContext>
      </UIContext>
    );
  }

  afterEach(() => {
    cleanup();
  });

  it("renders all reflections", () => {
    const reflections = [
      testReflection,
      { ...testReflection, id: "test-id-002", title: "Second Reflection" },
      { ...testReflection, id: "test-id-003", title: "Third Reflection" },
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
