import React, { useState, type SetStateAction } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ReflectionDetail } from "./ReflectionDetail";
import { testReflection } from "../../__mocks__/mockReflections";

describe("ReflectionDetail", () => {
  let mockSetIsEditing: ReturnType<typeof vi.fn>;

  function ReflectionDetailWrapper() {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const handleSelect = (toggle: SetStateAction<boolean>) => {
      setIsEditing(toggle);
      mockSetIsEditing(toggle);
    };

    return (
      <ReflectionDetail
        reflection={testReflection}
        isEditing={isEditing}
        setIsEditing={handleSelect}
      />
    );
  }

  beforeEach(() => {
    mockSetIsEditing = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the reflection title, date updated and content", () => {
    render(<ReflectionDetailWrapper />);

    expect(screen.getByText(testReflection.title)).toBeInTheDocument();
    expect(screen.getByText(testReflection.content)).toBeInTheDocument();
  });
  it("sets isEditing to true when Reflection title is clicked on", async () => {
    render(<ReflectionDetailWrapper />);
    const title = screen.getByTestId("details-title");

    await userEvent.click(title);

    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });
  it("sets isEditing to true when header is focused", async () => {
    render(<ReflectionDetailWrapper />);

    fireEvent.focus(screen.getByTestId("details-title"));

    expect(mockSetIsEditing).toHaveBeenCalledExactlyOnceWith(true);
  });
  it("sets IsEditing to true when reflection body is clicked on", async () => {
    render(<ReflectionDetailWrapper />);
    const body = screen.getByTestId("details-body");

    await userEvent.click(body);

    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });
});
