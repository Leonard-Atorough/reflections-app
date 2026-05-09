import { Aside } from "./Aside";
import { render, screen, fireEvent } from "@testing-library/react";
import { generateMockReflections } from "@/__mocks__/mockReflections";
import { createContextWrapper } from "@/test/contextWrappers";
import { useResponsive } from "@/hooks/useResponsive";

vi.mock("@/hooks/useResponsive");

describe("Sidebar component", () => {
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
    it("Renders a sidebar component with a header, button and a list with passed in reflection props", () => {
      const reflections = generateMockReflections(3);

      const wrapper = createContextWrapper({
        reflections,
        selectedId: null,
        isSidebarOpen: true,
        dispatch: () => {},
      });
      render(<Aside />, { wrapper });

      const asideElement = screen.getByRole("complementary");
      expect(asideElement).toBeInTheDocument();
      expect(asideElement).toHaveAttribute("data-is-overlay", "false");
      expect(asideElement).toHaveAttribute("aria-hidden", "false");
      const headerElement = screen.getByRole("heading", { name: "My Reflections" });
      expect(headerElement).toBeInTheDocument();
      const buttonElement = screen.getByLabelText("Add reflection");
      expect(buttonElement).toBeInTheDocument();
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(reflections.length);
    });

    it("should render the sidebar as an overlay on mobile devices", () => {
      // Mock mobile view
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        orientation: "portrait",
      });
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        isSidebarOpen: true,
        dispatch: () => {},
      });
      render(<Aside />, { wrapper });

      const asideElement = screen.getByRole("complementary");
      expect(asideElement).toHaveAttribute("data-is-overlay", "true");
      expect(asideElement).toHaveAttribute("aria-hidden", "false");
    });

    it("should render the sidebar as an overlay on tablet devices", () => {
      // Mock tablet view
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        orientation: "portrait",
      });
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        isSidebarOpen: true,
        dispatch: () => {},
      });

      render(<Aside />, { wrapper });

      const asideElement = screen.getByRole("complementary");
      expect(asideElement).toHaveAttribute("data-is-overlay", "true");
      expect(asideElement).toHaveAttribute("aria-hidden", "false");
    });
  });

  describe("interactions", () => {
    it("calls the add reflection button click handler", () => {
      const setIsEditing = vi.fn();
      const wrapper = createContextWrapper({
        reflections: [],
        selectedId: null,
        dispatch: () => {},
        setIsEditing,
      });

      render(<Aside />, { wrapper });

      const buttonElement = screen.getByLabelText("Add reflection");
      expect(buttonElement).toBeInTheDocument();
      fireEvent.click(buttonElement);
      expect(setIsEditing).toHaveBeenCalledWith(true);
    });
  });
});
