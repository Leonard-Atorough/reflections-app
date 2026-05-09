import { render } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

describe("ErrorBoundary", () => {
  describe("when an error is thrown in a child component", () => {
    it("should catch the error and display the fallback UI", () => {
      const ThrowError = () => {
        throw new Error("Test error");
      };

      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(getByText("Something went wrong")).toBeInTheDocument();
      expect(getByText("Test error")).toBeInTheDocument();
    });

    it("should reload the page when the reload button is clicked", () => {
      const ThrowError = () => {
        throw new Error("Test error");
      };

      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const reloadButton = getByText("Reload Page");

      // Mock window.location.reload
      const reloadMock = vi.fn();
      Object.defineProperty(window, "location", {
        value: { reload: reloadMock },
        writable: true,
      });
      reloadButton.click();
      expect(reloadMock).toHaveBeenCalled();
    });

    it("should show a generic message if the error has no message", () => {
      const ThrowError = () => {
        throw new Error();
      };

      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(getByText("An unexpected error occurred")).toBeInTheDocument();
    });
  });
});
