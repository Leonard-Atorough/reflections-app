import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the title, content, and action buttons", () => {
    const onAccept = vi.fn();
    const onCancel = vi.fn();

    render(
      <Dialog title="Test Title" content="Test Content" onAccept={onAccept} onCancel={onCancel} />,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("does not render accept button when onAccept is not provided", () => {
    render(<Dialog title="Test Title" content="Test Content" onCancel={() => {}} />);

    expect(screen.queryByRole("button", { name: /accept/i })).not.toBeInTheDocument();
  });

  it("does not render cancel button when onCancel is not provided", () => {
    render(<Dialog title="Test Title" content="Test Content" onAccept={() => {}} />);

    expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument();
  });

  it("calls onAccept when accept button is clicked", async () => {
    const onAccept = vi.fn();
    const onCancel = vi.fn();

    render(
      <Dialog title="Test Title" content="Test Content" onAccept={onAccept} onCancel={onCancel} />,
    );

    const acceptButton = screen.getByRole("button", { name: /accept/i });
    await userEvent.click(acceptButton);

    expect(onAccept).toHaveBeenCalledOnce();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onAccept = vi.fn();
    const onCancel = vi.fn();

    render(
      <Dialog title="Test Title" content="Test Content" onAccept={onAccept} onCancel={onCancel} />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("calls onCancel when escape key is pressed", async () => {
    const onCancel = vi.fn();

    render(<Dialog title="Test Title" content="Test Content" onCancel={onCancel} />);

    await userEvent.keyboard("{Escape}");

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onCancel when clicking outside the dialog", async () => {
    const onCancel = vi.fn();

    render(<Dialog title="Test Title" content="Test Content" onCancel={onCancel} />);

    const wrapper = screen.getByRole("dialog").parentElement;
    if (wrapper) {
      await userEvent.click(wrapper, { pointerEventsCheck: 0 });
    }

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("does not close dialog when clicking inside the dialog content", async () => {
    const onCancel = vi.fn();

    render(<Dialog title="Test Title" content="Test Content" onCancel={onCancel} />);

    const content = screen.getByText("Test Content");
    await userEvent.click(content);

    expect(onCancel).not.toHaveBeenCalled();
  });

  it("traps focus within the dialog using Tab key", async () => {
    const { container } = render(
      <Dialog title="Test Title" content="Test Content" onAccept={() => {}} onCancel={() => {}} />,
    );

    const buttons = container.querySelectorAll("button");

    if (buttons.length >= 2) {
      const firstButton = buttons[0];
      const lastButton = buttons[buttons.length - 1];

      firstButton.focus();
      await userEvent.keyboard("{Shift>}{Tab}{/Shift}");

      expect(document.activeElement).toBe(lastButton);

      lastButton.focus();
      await userEvent.keyboard("{Tab}");

      expect(document.activeElement).toBe(firstButton);
    }
  });

  it("has correct accessibility attributes", () => {
    render(
      <Dialog title="Test Title" content="Test Content" onAccept={() => {}} onCancel={() => {}} />,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "dialog-title");
    expect(dialog).toHaveAttribute("aria-describedby", "dialog-content");

    const title = screen.getByText("Test Title");
    expect(title).toHaveAttribute("id", "dialog-title");

    const content = screen.getByText("Test Content");
    expect(content).toHaveAttribute("id", "dialog-content");
  });

  it("applies custom style prop to wrapper for visibility control", () => {
    const customStyle = { opacity: 0, pointerEvents: "none" as const };
    const { container } = render(
      <Dialog title="Test Title" content="Test Content" onCancel={() => {}} style={customStyle} />,
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle("opacity: 0");
    expect(wrapper).toHaveStyle("pointer-events: none");
  });

  it("is always present in DOM for smooth transitions", () => {
    const { rerender } = render(
      <Dialog
        title="Test Title"
        content="Test Content"
        style={{ opacity: 0, pointerEvents: "none" }}
        onCancel={() => {}}
      />,
    );

    // Dialog should always be in the DOM
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();

    // Re-render with visible state
    rerender(
      <Dialog
        title="Test Title"
        content="Test Content"
        style={{ opacity: 1, pointerEvents: "auto" }}
        onCancel={() => {}}
      />,
    );

    // Still in DOM with new styles applied
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
