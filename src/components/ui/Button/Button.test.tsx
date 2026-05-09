import { render, screen } from "@testing-library/react";
import { Button, type ButtonSize, type ButtonVariant } from "./Button";
import userEvent from "@testing-library/user-event";

describe("Button component", () => {
  it.each([
    ["primary", "primary"],
    ["secondary", "secondary"],
    ["outline", "outline"],
    ["danger", "danger"],
    [undefined, "primary"], // default variant
  ])("applies the correct class for variant '%s'", (variant, expectedClass) => {
    const onClick = vi.fn();
    render(
      <Button variant={variant as ButtonVariant | undefined} onClick={onClick}>
        Test
      </Button>,
    );
    const buttonElement = screen.getByRole("button");
    expect(buttonElement.className).toContain(`btn-${expectedClass}`);
  });

  it.each([
    ["small", "small"],
    ["medium", "medium"],
    ["large", "large"],
    [undefined, "medium"], // default size
  ])("applies the correct class for size '%s'", (size, expectedClass) => {
    const onClick = vi.fn();
    render(
      <Button size={size as ButtonSize | undefined} onClick={onClick}>
        Test
      </Button>,
    );
    const buttonElement = screen.getByRole("button");
    expect(buttonElement.className).toContain(`btn-${expectedClass}`);
  });

  it("calls onClick handler when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click Me</Button>);
    const buttonElement = screen.getByRole("button");
    await userEvent.click(buttonElement);
    expect(onClick).toHaveBeenCalled();
  });

  it("sets aria-label based on children when ariaLabel prop is not provided", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Accessible Button</Button>);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveAttribute("aria-label", "Accessible Button");
  });

  it("uses ariaLabel prop when provided", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} ariaLabel="Custom Aria Label">
        Button
      </Button>,
    );
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveAttribute("aria-label", "Custom Aria Label");
  });

  it("does not set aria-label when children is not a string and ariaLabel prop is not provided", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick}>
        <span>Icon</span>
      </Button>,
    );
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).not.toHaveAttribute("aria-label");
  });
});
