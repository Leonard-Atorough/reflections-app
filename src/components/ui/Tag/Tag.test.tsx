import { render, screen } from "@testing-library/react";
import { Tag } from "./Tag";
import { tagColorMap } from "@/types/Tag";

describe("Tag component", () => {
  it("renders the tag name and title", () => {
    render(<Tag name="Important" color="red" />);

    const el = screen.getByText("Important");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("title", "Important");
  });

  it("applies the correct background color from the tagColorMap", () => {
    render(<Tag name="BlueTag" color="blue" />);

    const el = screen.getByText("BlueTag");
    expect(el).toBeInTheDocument();
    expect(el).toHaveStyle({ backgroundColor: tagColorMap.blue });
  });

  it("renders an empty name and sets the title attribute when name is empty", () => {
    const { container } = render(<Tag name="" color="gray" />);
    const el = container.querySelector("span");
    expect(el).toBeTruthy();
    expect(el).toHaveAttribute("title", "");
    expect(el).toHaveTextContent("");
  });

  it("does not interpret name as HTML (prevents basic XSS), and renders it as text", () => {
    const malicious = "<img src=x onerror=alert(1)>";
    const { container } = render(<Tag name={malicious} color="pink" />);
    const el = container.querySelector("span");
    expect(el).toBeTruthy();
    // There should be no child <img> element created from the string
    expect(el?.querySelector("img")).toBeNull();
    // The text content should include the raw characters
    expect(el).toHaveTextContent(malicious);
  });

  it("renders very long names without truncation", () => {
    const long = "a".repeat(1000);
    render(<Tag name={long} color="green" />);
    const el = screen.getByText(long);
    expect(el).toBeInTheDocument();
  });

  it("handles an invalid color gracefully (no inline background color)", () => {
    // Bypass TypeScript by casting to any to simulate unexpected runtime value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { container } = render(<Tag name="Weird" color={"teal" as any} />);
    const el = container.querySelector("span");
    expect(el).toBeTruthy();
    // style.backgroundColor should be empty string when not set
    expect((el as HTMLElement).style.backgroundColor).toBe("");
  });
});
