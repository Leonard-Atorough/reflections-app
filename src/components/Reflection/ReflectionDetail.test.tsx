import React, { useState } from "react";
import { fireEvent, getByTestId, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { ReflectionDetail } from "./ReflectionDetail";
import { testReflection } from "../../__mocks__/mockReflections";

function ReflectionDetailWrapper() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <ReflectionDetail
      reflection={testReflection}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
}

describe("ReflectionDetail", () => {
  it("renders the reflection title, date updated and content", () => {
    render(<ReflectionDetailWrapper />);

    expect(screen.getByText(testReflection.title)).toBeInTheDocument();
    expect(screen.getByText(testReflection.content)).toBeInTheDocument();
  });

  it("sets isEditing to true when header is focused", async() => {
    render(<ReflectionDetailWrapper/>);

    await fireEvent.focus(screen.getByTestId("Details header"));

    
  })
});
