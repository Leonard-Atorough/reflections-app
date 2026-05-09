//TESTS:
// - should initialize with correct breakpoint based on window width
// - should update breakpoint state on window resize
// - should initialize with correct orientation based on window orientation
// - should update orientation state on orientation change
// - should clean up event listeners on unmount

import { renderHook, act } from "@testing-library/react";
import { useResponsive } from "./useResponsive";
import { DEBOUNCE_DELAYS, RESPONSIVE_BREAKPOINTS } from "@/config/constants";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Global store for media query listeners
const mediaQueryListeners = new Map<string, Set<(e: MediaQueryListEvent) => void>>();

describe("useResponsive", () => {
  beforeEach(() => {
    mediaQueryListeners.clear();

    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => {
      if (!mediaQueryListeners.has(query)) {
        mediaQueryListeners.set(query, new Set());
      }

      const mockObject = {
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
          if (event === "change") {
            mediaQueryListeners.get(query)?.add(listener);
          }
        }),
        removeEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
          if (event === "change") {
            mediaQueryListeners.get(query)?.delete(listener);
          }
        }),
        dispatchEvent: vi.fn(),
      } as unknown as MediaQueryList;

      // Use Object.defineProperty to make matches a dynamic getter
      Object.defineProperty(mockObject, "matches", {
        get: () => evaluateMediaQuery(query),
        configurable: true,
      });

      return mockObject;
    });

    // Use fake timers to control debouncing
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Initialization", () => {
    it.each([
      {
        width: RESPONSIVE_BREAKPOINTS.MOBILE - 1,
        expected: { isMobile: true, isTablet: false, isDesktop: false },
        label: "mobile",
      },
      {
        width: RESPONSIVE_BREAKPOINTS.MOBILE + 100,
        expected: { isMobile: false, isTablet: true, isDesktop: false },
        label: "tablet",
      },
      {
        width: RESPONSIVE_BREAKPOINTS.TABLET + 100,
        expected: { isMobile: false, isTablet: false, isDesktop: true },
        label: "desktop",
      },
    ])(
      "should initialize with correct breakpoint for $label width ($width px)",
      ({ width, expected }) => {
        window.innerWidth = width;
        const { result } = renderHook(() => useResponsive());
        expect(result.current.isMobile).toBe(expected.isMobile);
        expect(result.current.isTablet).toBe(expected.isTablet);
        expect(result.current.isDesktop).toBe(expected.isDesktop);
      },
    );

    it("should initialize with default orientation when enableOrientation is false", () => {
      window.innerWidth = 800;
      window.innerHeight = 1200;
      const { result } = renderHook(() => useResponsive({ enableOrientation: false }));
      expect(result.current.orientation).toBe(null);
    });

    it("should initialize with portrait orientation", () => {
      window.innerWidth = 800;
      window.innerHeight = 1200;
      const { result } = renderHook(() => useResponsive({ enableOrientation: true }));
      expect(result.current.orientation).toBe("portrait");
    });

    it("should initialize with landscape orientation", () => {
      window.innerWidth = 1200;
      window.innerHeight = 800;
      const { result } = renderHook(() => useResponsive({ enableOrientation: true }));
      expect(result.current.orientation).toBe("landscape");
    });
  });

  describe("Breakpoint Changes", () => {
    it("should update breakpoint state on window resize", () => {
      window.innerWidth = RESPONSIVE_BREAKPOINTS.MOBILE - 1;
      const { result } = renderHook(() => useResponsive());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);

      // Resize to tablet
      act(() => {
        window.innerWidth = RESPONSIVE_BREAKPOINTS.MOBILE + 100;
        triggerMediaQueryListeners();
        vi.advanceTimersByTime(DEBOUNCE_DELAYS.RESPONSIVE_RESIZE);
      });

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);

      // Resize to desktop
      act(() => {
        window.innerWidth = RESPONSIVE_BREAKPOINTS.TABLET + 100;
        triggerMediaQueryListeners();
        vi.advanceTimersByTime(DEBOUNCE_DELAYS.RESPONSIVE_RESIZE);
      });

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });

    it("should debounce rapid resize events", () => {
      window.innerWidth = RESPONSIVE_BREAKPOINTS.MOBILE - 1;
      const { result } = renderHook(() => useResponsive());

      // Trigger multiple rapid resize events
      act(() => {
        window.innerWidth = 900;
        triggerMediaQueryListeners();
        vi.advanceTimersByTime(50); // Halfway through debounce

        window.innerWidth = 1000;
        triggerMediaQueryListeners();
        vi.advanceTimersByTime(50); // Another 50ms

        window.innerWidth = 1100;
        triggerMediaQueryListeners();
        // Still within initial 100ms debounce, should not update yet

        vi.advanceTimersByTime(100); // Complete the debounce
      });

      // Should only update once with the final value
      expect(result.current.isDesktop).toBe(true);
    });

    it("should handle exact breakpoint boundaries", () => {
      window.innerWidth = RESPONSIVE_BREAKPOINTS.MOBILE;
      const { result } = renderHook(() => useResponsive());
      expect(result.current.isMobile).toBe(true);

      act(() => {
        window.innerWidth = RESPONSIVE_BREAKPOINTS.MOBILE + 1;
        triggerMediaQueryListeners();
        vi.advanceTimersByTime(DEBOUNCE_DELAYS.RESPONSIVE_RESIZE);
      });
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
    });
  });

  describe("Orientation", () => {
    it("should update orientation on orientation change", () => {
      window.innerWidth = 800;
      window.innerHeight = 1200; // portrait
      const { result } = renderHook(() => useResponsive({ enableOrientation: true }));
      expect(result.current.orientation).toBe("portrait");

      // Change to landscape
      act(() => {
        window.innerWidth = 1200;
        window.innerHeight = 800;
        triggerMediaQueryListeners();
        vi.advanceTimersByTime(DEBOUNCE_DELAYS.RESPONSIVE_RESIZE);
      });
      expect(result.current.orientation).toBe("landscape");

      // Change back to portrait
      act(() => {
        window.innerWidth = 800;
        window.innerHeight = 1200;
        triggerMediaQueryListeners();
        vi.advanceTimersByTime(DEBOUNCE_DELAYS.RESPONSIVE_RESIZE);
      });
      expect(result.current.orientation).toBe("portrait");
    });

    it("should handle square aspect ratio as landscape", () => {
      window.innerWidth = 1000;
      window.innerHeight = 1000;
      const { result } = renderHook(() => useResponsive({ enableOrientation: true }));
      // When width > height is false (1000 > 1000 = false), should be landscape
      expect(result.current.orientation).toBe("landscape");
    });
  });

  describe("Event Listeners", () => {
    it("should clean up event listeners on unmount", () => {
      const { unmount } = renderHook(() => useResponsive({ enableOrientation: true }));

      // Verify listeners are registered
      let totalListeners = 0;
      mediaQueryListeners.forEach((listeners) => {
        totalListeners += listeners.size;
      });
      expect(totalListeners).toBeGreaterThan(0);

      unmount();

      // After unmounting, there should be no listeners for any query
      mediaQueryListeners.forEach((listeners) => {
        expect(listeners.size).toBe(0);
      });
    });

    it("should register listeners for all breakpoint queries", () => {
      renderHook(() => useResponsive());

      // Should have listeners for mobile, tablet, and desktop queries
      expect(mediaQueryListeners.has(`(max-width: ${RESPONSIVE_BREAKPOINTS.MOBILE}px)`)).toBe(true);
      expect(
        mediaQueryListeners.has(
          `(min-width: ${RESPONSIVE_BREAKPOINTS.MOBILE + 1}px) and (max-width: ${RESPONSIVE_BREAKPOINTS.TABLET}px)`,
        ),
      ).toBe(true);
      expect(mediaQueryListeners.has(`(min-width: ${RESPONSIVE_BREAKPOINTS.TABLET + 1}px)`)).toBe(
        true,
      );
    });

    it("should not register orientation listener when enableOrientation is false", () => {
      renderHook(() => useResponsive({ enableOrientation: false }));

      const hasOrientationListener = Array.from(mediaQueryListeners.keys()).some((query) =>
        query.includes("orientation"),
      );
      expect(hasOrientationListener).toBe(false);
    });

    it("should register orientation listener when enableOrientation is true", () => {
      renderHook(() => useResponsive({ enableOrientation: true }));

      const hasOrientationListener = Array.from(mediaQueryListeners.keys()).some((query) =>
        query.includes("orientation"),
      );
      expect(hasOrientationListener).toBe(true);
    });
  });

  describe("Configuration & Validation", () => {
    it("should handle invalid breakpoints by falling back to defaults", () => {
      const invalidBreakpoints = {
        mobile: 1000,
        tablet: 500,
        desktop: 300,
      };
      const { result } = renderHook(() => useResponsive({ breakpoints: invalidBreakpoints }));
      expect(result.current.isMobile).toBe(window.innerWidth <= RESPONSIVE_BREAKPOINTS.MOBILE);
      expect(result.current.isTablet).toBe(
        window.innerWidth > RESPONSIVE_BREAKPOINTS.MOBILE &&
          window.innerWidth <= RESPONSIVE_BREAKPOINTS.TABLET,
      );
      expect(result.current.isDesktop).toBe(window.innerWidth > RESPONSIVE_BREAKPOINTS.TABLET);
    });

    it("should handle invalid debounceDelay by falling back to default", () => {
      const { result } = renderHook(() => useResponsive({ debounceDelay: -100 }));
      expect(result.current.isMobile).toBe(window.innerWidth <= RESPONSIVE_BREAKPOINTS.MOBILE);
    });

    it("should handle zero debounceDelay", () => {
      window.innerWidth = RESPONSIVE_BREAKPOINTS.MOBILE - 1;
      const { result } = renderHook(() => useResponsive({ debounceDelay: 0 }));

      act(() => {
        window.innerWidth = RESPONSIVE_BREAKPOINTS.MOBILE + 100;
        triggerMediaQueryListeners();
        vi.advanceTimersByTime(0); // Should update immediately
      });

      expect(result.current.isTablet).toBe(true);
    });

    it("should handle invalid enableOrientation by falling back to false", () => {
      const { result } = renderHook(() =>
        useResponsive({ enableOrientation: "invalid" as unknown as boolean }),
      );
      expect(result.current.orientation).toBe(null);
    });

    it("should use custom breakpoints when provided", () => {
      const customBreakpoints = {
        mobile: 500,
        tablet: 900,
        desktop: 1300,
      };
      window.innerWidth = 700;
      const { result } = renderHook(() => useResponsive({ breakpoints: customBreakpoints }));

      // 700 > 500 + 1 and 700 <= 900, so should be tablet
      expect(result.current.isTablet).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should not set up any listeners if matchMedia is not supported", () => {
      vi.spyOn(window, "matchMedia").mockImplementation(() => {
        return {
          matches: false,
          media: "",
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        } as unknown as MediaQueryList;
      });
      const { result } = renderHook(() => useResponsive());
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.orientation).toBe(null);
    });
  });
});

function evaluateMediaQuery(query: string): boolean {
  // Handle combined queries like "(min-width: 769px) and (max-width: 1024px)"
  if (query.includes(" and ")) {
    const parts = query.split(" and ");
    return parts.every((part) => evaluateSingleQuery(part.trim()));
  }
  return evaluateSingleQuery(query);
}

function evaluateSingleQuery(query: string): boolean {
  const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);
  const minWidthMatch = query.match(/min-width:\s*(\d+)px/);

  if (maxWidthMatch) {
    return window.innerWidth <= parseInt(maxWidthMatch[1]);
  }
  if (minWidthMatch) {
    return window.innerWidth >= parseInt(minWidthMatch[1]);
  }
  if (query === "(orientation: portrait)") {
    return window.innerHeight > window.innerWidth;
  }
  if (query === "(orientation: landscape)") {
    return window.innerWidth > window.innerHeight;
  }

  return false;
}

function triggerMediaQueryListeners(): void {
  const event = new Event("change") as MediaQueryListEvent;

  mediaQueryListeners.forEach((listeners, query) => {
    // Update the matches value based on current window state
    const matches = evaluateMediaQuery(query);
    (event as unknown as { matches: boolean }).matches = matches;
    (event as unknown as { media: string }).media = query;

    // Trigger all listeners for this query
    listeners.forEach((listener) => {
      listener(event);
    });
  });
}
