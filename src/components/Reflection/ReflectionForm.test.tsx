import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReflectionForm } from "./ReflectionForm";
import { testReflection } from "../../__mocks__/mockReflections";
import type { ReactNode } from "react";
import { EditingContext, ReflectionsContext } from "@/contexts";
import * as useReflectionActionsModule from "../../hooks/useReflectionActions";

let mockAddReflection: ReturnType<typeof vi.fn>;
let mockUpdateReflection: ReturnType<typeof vi.fn>;
let mockSetReflections: ReturnType<typeof vi.fn>;
let mockSetIsEditing: ReturnType<typeof vi.fn>;

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <EditingContext
      value={{
        isEditing: false,
        setIsEditing: mockSetIsEditing,
      }}
    >
      <ReflectionsContext
        value={{
          reflections: [],
          selectedId: null,
          dispatch: vi.fn(),
        }}
      >
        {children}
      </ReflectionsContext>
    </EditingContext>
  );
}

describe("ReflectionForm", () => {
  beforeEach(() => {
    mockSetIsEditing = vi.fn();
    mockAddReflection = vi.fn();
    mockUpdateReflection = vi.fn();
    mockSetReflections = vi.fn();
    vi.spyOn(useReflectionActionsModule, "useReflectionActions").mockReturnValue({
      addReflection: mockAddReflection,
      updateReflection: mockUpdateReflection,
      deleteReflection: vi.fn(),
      setReflections: mockSetReflections,
      setSelectedId: vi.fn(),
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("renders correctly when a reflection is passed in", () => {
    render(
      <TestWrapper>
        <ReflectionForm reflection={testReflection} />
      </TestWrapper>,
    );

    expect(screen.getByDisplayValue(testReflection.title)).toBeInTheDocument();
    expect(screen.getByText(testReflection.content)).toBeInTheDocument();
  });

  it("renders Empty form when Reflection is null", () => {
    render(
      <TestWrapper>
        <ReflectionForm reflection={null} />
      </TestWrapper>,
    );

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    const contentArea = screen.getByRole("textbox", { name: /content/i });

    expect(titleInput).toHaveValue("");
    expect(contentArea).toHaveValue("");
  });

  it("calls addReflection when a new reflection title is updated", () => {
    render(
      <TestWrapper>
        <ReflectionForm reflection={null} />
      </TestWrapper>,
    );

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    // While this would be ideal, it relies on real timers which conflicts with the vitest fake timer
    // await userEvent.type(titleInput, "User inputted Reflection");

    act(() => {
      fireEvent.change(titleInput, {
        target: { value: "User inputted Reflection" },
      });
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockAddReflection).toHaveBeenCalledTimes(1);
    const addedReflection = mockAddReflection.mock.calls[0][0];
    expect(addedReflection.title).toBe("User inputted Reflection");
    expect(addedReflection.content).toBe("");
  });
});
