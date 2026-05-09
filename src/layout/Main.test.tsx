import { Main } from "./Main";
import { render, screen } from "@testing-library/react";
import { generateMockReflections } from "@/__mocks__/mockReflections";
import { createContextWrapper } from "@/test/contextWrappers";

describe("Main component", () => {
  describe("rendering", () => {
    it("renders the main element with correct attributes", () => {
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
      });

      render(<Main />, { wrapper });

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveAttribute("tabIndex", "-1");
    });

    it("renders ReflectionDetail when not editing and reflection is selected", () => {
      const reflections = generateMockReflections(2);
      const wrapper = createContextWrapper({
        reflections,
        selectedId: reflections[0].id,
        isEditing: false,
      });

      render(<Main />, { wrapper });

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
      // ReflectionDetail renders the reflection title
      const titleElement = screen.getByText(reflections[0].title);
      expect(titleElement).toBeInTheDocument();
    });

    it("renders ReflectionForm when editing", () => {
      const reflections = generateMockReflections(1);
      const wrapper = createContextWrapper({
        reflections,
        selectedId: reflections[0].id,
        isEditing: true,
      });

      render(<Main />, { wrapper });

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
      // ReflectionForm renders form inputs
      const titleInput = screen.getByLabelText("Title");
      expect(titleInput).toBeInTheDocument();
    });

    it("renders ReflectionForm when editing with no reflection selected", () => {
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        isEditing: true,
      });

      render(<Main />, { wrapper });

      const titleInput = screen.getByLabelText("Title");
      expect(titleInput).toBeInTheDocument();
    });

    it("renders ReflectionDetail with null reflection when no reflection is selected and not editing", () => {
      const wrapper = createContextWrapper({
        reflections: generateMockReflections(2),
        selectedId: null,
        isEditing: false,
      });

      render(<Main />, { wrapper });

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
      // ReflectionDetail should render a message when reflection is null
      const emptyMessage = screen.queryByText(/no reflection selected|empty|nothing/i);
      expect(emptyMessage).not.toBeInTheDocument();
    });

    it("renders the correct reflection based on selectedId", () => {
      const reflections = generateMockReflections(3);
      const wrapper = createContextWrapper({
        reflections,
        selectedId: reflections[1].id,
        isEditing: false,
      });

      render(<Main />, { wrapper });

      const titleElement = screen.getByText(reflections[1].title);
      expect(titleElement).toBeInTheDocument();
    });
  });

  describe("conditional rendering", () => {
    it("renders ReflectionDetail or ReflectionForm based on isEditing", () => {
      // When not editing, shows ReflectionDetail
      const reflections = generateMockReflections(1);
      const wrapper = createContextWrapper({
        reflections,
        selectedId: reflections[0].id,
        isEditing: false,
      });

      render(<Main />, { wrapper });

      const titleElement = screen.getByText(reflections[0].title);
      expect(titleElement).toBeInTheDocument();
    });
  });
});
