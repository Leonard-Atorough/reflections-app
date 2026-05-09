import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReflectionForm } from "./ReflectionForm";
import { testReflection } from "../../__mocks__/mockReflections";
import { createContextWrapper } from "@/test/contextWrappers";

const mockAddReflection = vi.fn();
const mockUpdateReflection = vi.fn();
const mockSetReflections = vi.fn();
const mockSetSelectedId = vi.fn();

vi.mock("@hooks/useReflectionActions", () => ({
  ...vi.importActual("@hooks/useReflectionActions"),
  useReflectionActions: () => ({
    addReflection: mockAddReflection,
    updateReflection: mockUpdateReflection,
    deleteReflection: vi.fn(),
    setReflections: mockSetReflections,
    setSelectedId: mockSetSelectedId,
  }),
}));

describe("ReflectionForm", () => {
  let wrapper: ReturnType<typeof createContextWrapper>;

  beforeEach(() => {
    wrapper = createContextWrapper({
      reflections: [],
      selectedId: null,
    });
    mockAddReflection.mockClear();
    mockUpdateReflection.mockClear();
    mockSetReflections.mockClear();
    mockSetSelectedId.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("renders correctly when a reflection is passed in", () => {
    render(<ReflectionForm reflection={testReflection} />, { wrapper });

    expect(screen.getByDisplayValue(testReflection.title)).toBeInTheDocument();
    expect(screen.getByText(testReflection.content)).toBeInTheDocument();
  });

  it("renders Empty form when Reflection is null", () => {
    render(<ReflectionForm reflection={null} />, { wrapper });

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    const contentArea = screen.getByRole("textbox", { name: /content/i });

    expect(titleInput).toHaveValue("");
    expect(contentArea).toHaveValue("");
  });

  it("calls addReflection when a new reflection title is updated", () => {
    render(<ReflectionForm reflection={null} />, { wrapper });

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

  it("calls updateReflection when an existing reflection title is updated", () => {
    const reflections = [testReflection];
    const wrapperWithReflection = createContextWrapper({
      reflections,
      selectedId: testReflection.id,
    });
    render(<ReflectionForm reflection={testReflection} />, { wrapper: wrapperWithReflection });
    const titleInput = screen.getByRole("textbox", { name: /title/i });

    act(() => {
      fireEvent.change(titleInput, {
        target: { value: "Updated Title" },
      });
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockUpdateReflection).toHaveBeenCalledTimes(1);
    const updatedReflection = mockUpdateReflection.mock.calls[0][0];
    expect(updatedReflection.id).toBe(testReflection.id);
    expect(updatedReflection.title).toBe("Updated Title");
    expect(updatedReflection.content).toBe(testReflection.content);
  });

  it("calls updateReflection when an existing reflection content is updated", () => {
    const reflections = [testReflection];
    const wrapperWithReflection = createContextWrapper({
      reflections,
      selectedId: testReflection.id,
    });
    render(<ReflectionForm reflection={testReflection} />, { wrapper: wrapperWithReflection });
    const contentArea = screen.getByRole("textbox", { name: /content/i });

    act(() => {
      fireEvent.change(contentArea, {
        target: { value: "Updated Content" },
      });
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockUpdateReflection).toHaveBeenCalledTimes(1);
    const updatedReflection = mockUpdateReflection.mock.calls[0][0];
    expect(updatedReflection.id).toBe(testReflection.id);
    expect(updatedReflection.title).toBe(testReflection.title);
    expect(updatedReflection.content).toBe("Updated Content");
  });

  it("sets isEditing to false when escape key is pressed", async () => {
    const mockSetIsEditing = vi.fn();
    const wrapperWithEditingContext = createContextWrapper({
      reflections: [testReflection],
      selectedId: testReflection.id,
      setIsEditing: mockSetIsEditing,
    });

    render(<ReflectionForm reflection={testReflection} />, { wrapper: wrapperWithEditingContext });
    const titleInput = screen.getByRole("textbox", { name: /title/i });

    act(() => {
      fireEvent.keyDown(titleInput, { key: "Escape", code: "Escape" });
    });

    expect(mockSetIsEditing).toHaveBeenCalledWith(false);
  });
});
