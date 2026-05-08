import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReflectionForm } from "./ReflectionForm";
import { testReflection } from "../../__mocks__/mockReflections";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { EditingContext, ReflectionsContext } from "@/contexts";

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
          setReflections: mockSetReflections,
          selectedId: null,
          setSelectedId: vi.fn(),
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
    mockSetReflections = vi.fn();
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

  it("calls setReflections and adds a new reflection when title is updated", () => {
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

    expect(mockSetReflections).toHaveBeenCalledTimes(1);
    const updaterFn = mockSetReflections.mock.calls[0][0];
    //TODO: Fully understand this line and what its doing
    const result = updaterFn([]);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("User inputted Reflection");
    expect(result[0].content).toBe("");
  });

  it.skip("calls setReflections and updates reflection when title is changed", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ReflectionForm reflection={testReflection} />
      </TestWrapper>,
    );

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    await user.clear(titleInput);
    await user.type(titleInput, "User inputted Reflection");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await Promise.resolve();
    expect(mockSetReflections).toHaveBeenCalledTimes(1);
  });
});
