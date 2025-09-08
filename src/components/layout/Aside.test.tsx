import { Aside } from "./Aside";

import { render, screen } from "@testing-library/react";

import type { Reflection } from "../../types/Reflection";

const testReflections: Reflection[] = [
  {
    id: "test1",
    title: "Test Reflection 1",
    dateCreated: Date.now().toString(),
    dateUpdated: Date.now().toString(),
    content: "This is a test reflection, let it not be a deflection.",
  },
];

describe("Sidebar component", () => {
  it("Renders a sidebar component with a header, button and a list with passed in reflection props", () => {
    render(<Aside reflections={testReflections} />);

    expect(screen.getByText("Reflections")).toBeInTheDocument();
    expect(screen.getByText("Test Reflection 1")).toBeInTheDocument();
  });
});
