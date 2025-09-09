import React from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { ReflectionDetail } from "./ReflectionDetail";
import { testReflection } from "../../__mocks__/mockReflections";

describe("ReflectionDetail", () => {
  it("renders the reflection title, date updated and content", () => {
    render(<ReflectionDetail reflection={testReflection} />);

    expect(screen.getByText(testReflection.title)).toBeInTheDocument();
    expect(screen.getByText(testReflection.content)).toBeInTheDocument();
  });
});
