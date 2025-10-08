import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { ReflectionForm } from "./ReflectionForm";
import { testReflection } from "../../__mocks__/mockReflections";
import userEvent from "@testing-library/user-event";

let mockSetReflections: ReturnType<typeof vi.fn>;
let setIsEditing: ReturnType<typeof vi.fn>;

describe("ReflectionForm", () => {
  beforeEach(() => {
    setIsEditing = vi.fn();
    mockSetReflections = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("renders correctly when a reflection is passed in", () => {
    render(
      <ReflectionForm
        reflection={testReflection}
        setReflections={mockSetReflections}
        setIsEditing={setIsEditing}
      />
    );

    expect(screen.getByDisplayValue(testReflection.title)).toBeInTheDocument();
    expect(screen.getByText(testReflection.content)).toBeInTheDocument();
  });

  it("renders Empty form when Reflection is null", () => {
    render(
      <ReflectionForm
        reflection={null}
        setReflections={mockSetReflections}
        setIsEditing={setIsEditing}
      />
    );

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    const contentArea = screen.getByRole("textbox", { name: /content/i });

    expect(titleInput).toHaveValue("");
    expect(contentArea).toHaveValue("");
  });

  it("calls setReflections and adds a new reflection when title is updated", () => {
    render(
      <ReflectionForm
        reflection={null}
        setReflections={mockSetReflections}
        setIsEditing={setIsEditing}
      />
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
      <ReflectionForm
        reflection={testReflection}
        setReflections={mockSetReflections}
        setIsEditing={setIsEditing}
      />
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
