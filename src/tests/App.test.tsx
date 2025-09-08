import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App ui", () => {
  it("renders header, aside, main and footer when render is called", () => {
    render(<App />);

    expect(screen.getByText("Reflections App")).toBeInTheDocument();
  });
});
