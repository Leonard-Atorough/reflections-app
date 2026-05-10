import { cleanup, render, screen } from "@testing-library/react";
import { ReflectionsMenu } from "./ReflectionsMenu";
import { generateMockReflections } from "../../../__mocks__/mockReflections";
import { createContextWrapper } from "@/test/contextWrappers";

describe("ReflectionsMenu", () => {
  let wrapper: ReturnType<typeof createContextWrapper>;

  beforeEach(() => {
    wrapper = createContextWrapper({
      reflections: [generateMockReflections(1)[0]],
      selectedId: null,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders all reflections", () => {
    const reflections = generateMockReflections(3);

    render(<ReflectionsMenu reflections={reflections} />, { wrapper });

    expect(screen.getByText("Mock Reflection 1")).toBeInTheDocument();
    expect(screen.getByText("Mock Reflection 2")).toBeInTheDocument();
    expect(screen.getByText("Mock Reflection 3")).toBeInTheDocument();
  });

  it("renders empty list when no reflections provided", () => {
    render(<ReflectionsMenu reflections={[]} />, { wrapper });

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    expect(listbox).toHaveAttribute("aria-label", "Reflections List");
  });

  it("has proper accessibility attributes", () => {
    const reflections = generateMockReflections(3);
    render(<ReflectionsMenu reflections={reflections} />, { wrapper });

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("aria-label", "Reflections List");
  });
});
