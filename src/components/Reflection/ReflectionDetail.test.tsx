import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ReflectionDetail } from "./ReflectionDetail";
import { generateMockReflections } from "@/__mocks__/mockReflections";
import { createContextWrapper } from "@/test/contextWrappers";

const mockDeleteReflection = vi.fn();

vi.mock("@hooks/useReflectionActions", () => ({
  ...vi.importActual("@hooks/useReflectionActions"),
  useReflectionActions: () => ({
    deleteReflection: mockDeleteReflection,
  }),
}));

describe("ReflectionDetail", () => {
  let mockSetIsEditing: ReturnType<typeof vi.fn>;
  let wrapper: ReturnType<typeof createContextWrapper>;
  let testReflection: ReturnType<typeof generateMockReflections>[0];

  beforeEach(() => {
    mockSetIsEditing = vi.fn();
    mockDeleteReflection.mockClear();
    [testReflection] = generateMockReflections(1);
    wrapper = createContextWrapper({
      reflections: [testReflection],
      selectedId: testReflection.id,
      dispatch: () => {},
      setIsEditing: mockSetIsEditing,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the reflection title, date updated and content", () => {
    render(<ReflectionDetail reflection={testReflection} />, { wrapper });

    expect(screen.getByText(testReflection.title)).toBeInTheDocument();
    expect(screen.getByText(testReflection.content)).toBeInTheDocument();
  });

  it("sets isEditing to true when Reflection title is clicked on", async () => {
    render(<ReflectionDetail reflection={testReflection} />, { wrapper });
    const title = screen.getByTestId("details-title");

    await userEvent.click(title);

    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it("sets IsEditing to true when reflection body is clicked on", async () => {
    render(<ReflectionDetail reflection={testReflection} />, { wrapper });
    const body = screen.getByTestId("details-body");

    await userEvent.click(body);

    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it("sets isEditing to true when enter key is pressed on the title", async () => {
    render(<ReflectionDetail reflection={testReflection} />, { wrapper });
    const title = screen.getByTestId("details-title");

    title.focus();
    await userEvent.keyboard("{Enter}");

    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it("sets isEditing to true when enter key is pressed on the body", async () => {
    render(<ReflectionDetail reflection={testReflection} />, { wrapper });
    const body = screen.getByTestId("details-body");

    body.focus();
    await userEvent.keyboard("{Enter}");

    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it("opens delete dialog when delete button is clicked", async () => {
    render(<ReflectionDetail reflection={testReflection} />, { wrapper });
    const deleteButton = screen.getByTestId("delete-reflection-button");

    await userEvent.click(deleteButton);

    expect(screen.getByText("Delete Reflection")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete this reflection? This action cannot be undone.",
      ),
    ).toBeInTheDocument();
  });

  it("calls deleteReflection when delete dialog is accepted", async () => {
    render(<ReflectionDetail reflection={testReflection} />, { wrapper });
    const deleteButton = screen.getByTestId("delete-reflection-button");

    await userEvent.click(deleteButton);

    const acceptButton = screen.getByRole("button", { name: /accept/i });
    await userEvent.click(acceptButton);

    expect(mockDeleteReflection).toHaveBeenCalledWith(testReflection.id);
    expect(mockSetIsEditing).toHaveBeenCalledWith(false);
  });

  it("does not call deleteReflection when delete dialog is cancelled", async () => {
    render(<ReflectionDetail reflection={testReflection} />, { wrapper });
    const deleteButton = screen.getByTestId("delete-reflection-button");

    await userEvent.click(deleteButton);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockDeleteReflection).not.toHaveBeenCalled();
    expect(mockSetIsEditing).not.toHaveBeenCalledWith(false);
  });

  it("handles delete when selectedId is null", async () => {
    const nullSelectedIdWrapper = createContextWrapper({
      reflections: [testReflection],
      selectedId: null,
      dispatch: () => {},
      setIsEditing: mockSetIsEditing,
    });

    render(<ReflectionDetail reflection={testReflection} />, { wrapper: nullSelectedIdWrapper });
    const deleteButton = screen.getByTestId("delete-reflection-button");

    await userEvent.click(deleteButton);

    const acceptButton = screen.getByRole("button", { name: /accept/i });
    await userEvent.click(acceptButton);

    expect(mockDeleteReflection).not.toHaveBeenCalled();
  });
});
