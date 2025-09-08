import React from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import type { Reflection } from "../../types/Reflection";
import { ReflectionDetail } from "./ReflectionDetail";

const testReflection: Reflection = {
  id: "test1",
  title: "First Test Reflection",
  dateCreated: "2025-09-01T09:15:00.000Z",
  dateUpdated: "2025-09-01T09:15:00.000Z",
  content:
    "This is test content meant to be used to simulate the content of a reflection item",
};

describe("ReflectionDetail", () => {
  it("renders the reflection title, date updated and content", () => {
    render(<ReflectionDetail reflection={testReflection} />);

    expect(screen.getByText("First Test Reflection")).toBeInTheDocument();
    expect(screen.getByText(testReflection.content)).toBeInTheDocument();
  });
});
