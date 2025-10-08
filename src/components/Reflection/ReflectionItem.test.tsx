import { useState } from "react";

import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { ReflectionItem } from "./ReflectionItem";
import styles from "./ReflectionItem.module.css";
import { testReflection } from "../../__mocks__/mockReflections";
import { formatDate } from "../../utils/formatDate";

describe("ReflectionItem", () => {
  function ReflectionItemWrapper({
    isEditing = false,
  }: {
    isEditing?: boolean;
  }) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (id: string | null) => {
      setSelectedId(id); // update internal state
      mockSetSelectedId(id); // keep the spy for assertions
    };

    return (
      <>
        <ReflectionItem
          reflection={testReflection}
          setSelectedId={handleSelect}
          isSelected={selectedId === testReflection.id}
          isEditing={isEditing}
          setIsEditing={mockSetIsEditing}
          setSidebarVisible={setSidebarVisible}
        />
      </>
    );
  }

  let mockSetIsEditing: ReturnType<typeof vi.fn>;
  let mockSetSelectedId: ReturnType<typeof vi.fn>;
  let setSidebarVisible: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetIsEditing = vi.fn();
    mockSetSelectedId = vi.fn();
    setSidebarVisible = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the reflecion item correctly", () => {
    render(<ReflectionItemWrapper />);
    expect(screen.getByText(testReflection.title)).toBeInTheDocument();
    const formattedDate = formatDate(testReflection.dateUpdated) ?? "";
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it("calls setSelectedId with reflectionId when clicked once", async () => {
    render(<ReflectionItemWrapper />);
    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);

    expect(mockSetSelectedId).toHaveBeenCalledWith(testReflection.id);
    expect(mockSetSelectedId).toHaveBeenCalledOnce();
  });

  it("calls onSelect with reflectionId when enter is pressed", async () => {
    render(<ReflectionItemWrapper />);
    const item = screen.getByTestId("reflection-button");
    item.focus();
    await userEvent.keyboard("{enter}");

    expect(mockSetSelectedId).toHaveBeenCalledWith(testReflection.id);
    expect(mockSetSelectedId).toHaveBeenCalledOnce();
  });

  it("adds the selected style to the list element when selected", async () => {
    render(<ReflectionItemWrapper />);
    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);
    expect(screen.getByTestId("reflection-button")).toHaveClass(
      styles.selected
    );
  });

  it("calls onSelect with null when clicked twice", async () => {
    render(<ReflectionItemWrapper />);
    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);
    expect(mockSetSelectedId).toHaveBeenCalledOnce();
    expect(mockSetSelectedId).toHaveBeenCalledWith(testReflection.id);

    await userEvent.click(item);
    expect(mockSetSelectedId).toHaveBeenCalledTimes(2);
    expect(mockSetSelectedId).toHaveBeenCalledWith(null);
  });

  it("sets the isEditing state to false if it is true when item is clicked", async () => {
    render(<ReflectionItemWrapper isEditing={true} />);

    const item = screen.getByTestId("reflection-button");
    await userEvent.click(item);

    expect(mockSetIsEditing).toHaveBeenCalledExactlyOnceWith(false);
  });
});
