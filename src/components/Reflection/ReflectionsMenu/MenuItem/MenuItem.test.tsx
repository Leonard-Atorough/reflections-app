import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { ReflectionItem } from "./MenuItem";
import styles from "./MenuItem.module.css";
import { testReflection } from "@/__mocks__/mockReflections";
import { formatDate } from "@/utils/formatDate";
import { EditingContext, ReflectionsContext, SidebarContext } from "@contexts";
import * as useReflectionActionsModule from "@hooks";

describe("MenuItem", () => {
  let mockSetIsEditing: ReturnType<typeof vi.fn>;
  let mockSetSelectedId: ReturnType<typeof vi.fn>;
  let mockSetSidebarVisible: ReturnType<typeof vi.fn>;

  function MenuItemWrapper({
    isEditing = false,
    selectedId = null,
  }: {
    isEditing?: boolean;
    selectedId?: string | null;
  }) {
    return (
      <EditingContext
        value={{
          isEditing,
          setIsEditing: mockSetIsEditing,
        }}
      >
        <SidebarContext
          value={{
            isSidebarOpen: false,
            setIsSidebarOpen: mockSetSidebarVisible,
          }}
        >
          <ReflectionsContext
            value={{
              reflections: [],
              selectedId,
              dispatch: vi.fn(),
            }}
          >
            <ReflectionItem reflection={testReflection} />
          </ReflectionsContext>
        </SidebarContext>
      </EditingContext>
    );
  }

  beforeEach(() => {
    mockSetIsEditing = vi.fn();
    mockSetSelectedId = vi.fn();
    mockSetSidebarVisible = vi.fn();
    vi.spyOn(useReflectionActionsModule, "useReflectionActions").mockReturnValue({
      addReflection: vi.fn(),
      updateReflection: vi.fn(),
      deleteReflection: vi.fn(),
      setReflections: vi.fn(),
      setSelectedId: mockSetSelectedId,
    });
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

  it("adds the selected style to the list element when selected", () => {
    render(<MenuItemWrapper selectedId={testReflection.id} />);
    expect(screen.getByTestId("reflection-button")).toHaveClass(styles.selected);
  });

  it("sets the isEditing state to false if it is true when item is clicked", async () => {
    render(<MenuItemWrapper isEditing={true} />);

    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);

    expect(mockSetIsEditing).toHaveBeenCalledExactlyOnceWith(false);
  });
});
