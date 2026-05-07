import { useState } from "react";

import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { MenuItem } from "./MenuItem";
import styles from "./MenuItem.module.css";
import { testReflection } from "../../../../__mocks__/mockReflections";
import { formatDate } from "../../../../utils/formatDate";
import { UIContext } from "../../../../contexts/UIContext";
import { ReflectionsContext } from "../../../../contexts/ReflectionsContext";

describe("MenuItem", () => {
  let mockSetIsEditing: ReturnType<typeof vi.fn>;
  let mockSetSelectedId: ReturnType<typeof vi.fn>;
  let mockSetSidebarVisible: ReturnType<typeof vi.fn>;

  function MenuItemWrapper({ isEditing = false }: { isEditing?: boolean }) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (id: string | null) => {
      setSelectedId(id);
      mockSetSelectedId(id);
    };

    return (
      <UIContext
        value={{
          isEditing,
          setIsEditing: mockSetIsEditing,
          sidebarVisible: false,
          setSidebarVisible: mockSetSidebarVisible,
        }}
      >
        <ReflectionsContext
          value={{
            reflections: [],
            setReflections: vi.fn(),
            selectedId,
            setSelectedId: handleSelect as React.Dispatch<React.SetStateAction<string | null>>,
          }}
        >
          <MenuItem reflection={testReflection} />
        </ReflectionsContext>
      </UIContext>
    );
  }

  beforeEach(() => {
    mockSetIsEditing = vi.fn();
    mockSetSelectedId = vi.fn();
    mockSetSidebarVisible = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the reflecion item correctly", () => {
    render(<MenuItemWrapper />);
    expect(screen.getByText(testReflection.title)).toBeInTheDocument();
    const formattedDate = formatDate(testReflection.dateUpdated) ?? "";
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it("calls setSelectedId with reflectionId when clicked once", async () => {
    render(<MenuItemWrapper />);
    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);

    expect(mockSetSelectedId).toHaveBeenCalledWith(testReflection.id);
    expect(mockSetSelectedId).toHaveBeenCalledOnce();
  });

  it("calls onSelect with reflectionId when enter is pressed", async () => {
    render(<MenuItemWrapper />);
    const item = screen.getByTestId("reflection-button");
    item.focus();
    await userEvent.keyboard("{enter}");

    expect(mockSetSelectedId).toHaveBeenCalledWith(testReflection.id);
    expect(mockSetSelectedId).toHaveBeenCalledOnce();
  });

  it("adds the selected style to the list element when selected", async () => {
    render(<MenuItemWrapper />);
    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);
    expect(screen.getByTestId("reflection-button")).toHaveClass(styles.selected);
  });

  it("calls onSelect with null when clicked twice", async () => {
    render(<MenuItemWrapper />);
    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);
    expect(mockSetSelectedId).toHaveBeenCalledOnce();
    expect(mockSetSelectedId).toHaveBeenCalledWith(testReflection.id);

    await userEvent.click(item);
    expect(mockSetSelectedId).toHaveBeenCalledTimes(2);
    expect(mockSetSelectedId).toHaveBeenCalledWith(null);
  });

  it("sets the isEditing state to false if it is true when item is clicked", async () => {
    render(<MenuItemWrapper isEditing={true} />);

    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);

    expect(mockSetIsEditing).toHaveBeenCalledExactlyOnceWith(false);
  });
});
