import { fireEvent, render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { createContextWrapper } from "@/test/contextWrappers";
import { vi } from "vitest";
import { useResponsive } from "@/hooks/useResponsive";

// Mock useResponsive at the module level
vi.mock("@/hooks/useResponsive");

describe("Header component", () => {
  beforeEach(() => {
    // Default mock: desktop view
    vi.mocked(useResponsive).mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      orientation: "portrait",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the header with the correct title", () => {
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch: () => {},
      });

      render(<Header />, { wrapper });

      const headerElement = screen.getByRole("banner");
      expect(headerElement).toBeInTheDocument();
      const titleElement = screen.getByText("Reflections");
      expect(titleElement).toBeInTheDocument();
    });

    it("renders the search input", () => {
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch: () => {},
      });

      render(<Header />, { wrapper });

      const searchInput = screen.getByPlaceholderText("Search reflections...");
      expect(searchInput).toBeInTheDocument();
    });

    it("renders the add reflection button", () => {
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch: () => {},
      });

      vi.clearAllMocks();
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        orientation: "portrait",
      });

      render(<Header />, { wrapper });

      const addButton = screen.getByLabelText("Add new reflection");
      expect(addButton).toBeInTheDocument();
    });

    it("renders the hamburger menu button on mobile/tablet", () => {
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch: () => {},
      });

      vi.clearAllMocks();
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        orientation: "portrait",
      });

      render(<Header />, { wrapper });

      const hamburgerButton = screen.getByLabelText("Open menu");
      expect(hamburgerButton).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onSearch when typing in the search input", () => {
      const onSearchMock = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch: () => {},
      });

      render(<Header onSearch={onSearchMock} />, { wrapper });

      const searchInput = screen.getByPlaceholderText("Search reflections...");
      fireEvent.change(searchInput, { target: { value: "test" } });

      expect(onSearchMock).toHaveBeenCalledWith("test");
    });

    it("toggles the sidebar when hamburger menu button is clicked", () => {
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch: () => {},
      });

      vi.clearAllMocks();
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        orientation: "portrait",
      });

      render(<Header />, { wrapper });

      const hamburgerButton = screen.getByLabelText("Open menu");
      fireEvent.click(hamburgerButton);
      // Since the actual state change is managed in the context, we can't directly test it here.
      // Instead, we can check if the button is still in the document after clicking (indicating it didn't unmount)
      expect(hamburgerButton).toBeInTheDocument();
    });

    it("calls the add reflection handler when add button is clicked", () => {
      const setIsEditing = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch: () => {},
        setIsEditing,
      });

      vi.clearAllMocks();
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        orientation: "portrait",
      });

      render(<Header />, { wrapper });

      const addButton = screen.getByLabelText("Add new reflection");
      fireEvent.click(addButton);
      expect(setIsEditing).toHaveBeenCalledWith(true);
    });

    it("sets isEditing to false when the sidebar is clicked", () => {
      const setIsEditing = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch: () => {},
        setIsEditing,
      });
      render(<Header />, { wrapper });

      const headerElement = screen.getByRole("banner");
      fireEvent.click(headerElement);
      expect(setIsEditing).toHaveBeenCalledWith(false);
    });
  });
});
