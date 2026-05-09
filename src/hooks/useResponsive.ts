import { useEffect, useMemo, useRef, useState } from "react";
import { DEBOUNCE_DELAYS, RESPONSIVE_BREAKPOINTS } from "@/config/constants";

export interface UseResponsiveOptions {
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  debounceDelay?: number;
  enableOrientation?: boolean;
}

export interface UseResponsiveResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: "portrait" | "landscape" | null;
}

function isMediaMatchSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia !== "undefined" &&
    typeof window.matchMedia === "function"
  );
}

function sanitizeOptions(options: UseResponsiveOptions): UseResponsiveOptions {
  const { breakpoints, debounceDelay, enableOrientation } = options;
  if (breakpoints) {
    const { mobile, tablet, desktop } = breakpoints;
    breakpoints.mobile = mobile > 0 && mobile < tablet ? mobile : RESPONSIVE_BREAKPOINTS.MOBILE;
    breakpoints.tablet =
      tablet > breakpoints.mobile && tablet < desktop ? tablet : RESPONSIVE_BREAKPOINTS.TABLET;
    breakpoints.desktop = desktop > breakpoints.tablet ? desktop : RESPONSIVE_BREAKPOINTS.DESKTOP;
  }
  if (debounceDelay === undefined || typeof debounceDelay !== "number" || debounceDelay < 0) {
    options.debounceDelay = DEBOUNCE_DELAYS.RESPONSIVE_RESIZE; // default debounce delay
  }
  if (enableOrientation !== undefined && typeof enableOrientation !== "boolean") {
    options.enableOrientation = false; // default to false if invalid
  }

  return options;
}

export function useResponsive(options?: UseResponsiveOptions): UseResponsiveResult {
  const {
    breakpoints = {
      mobile: RESPONSIVE_BREAKPOINTS.MOBILE,
      tablet: RESPONSIVE_BREAKPOINTS.TABLET,
      desktop: RESPONSIVE_BREAKPOINTS.DESKTOP,
    },
    debounceDelay = DEBOUNCE_DELAYS.RESPONSIVE_RESIZE,
    enableOrientation = false,
  } = sanitizeOptions(options || {});

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breakpointsRef = useRef<typeof breakpoints>(breakpoints);

  breakpointsRef.current = breakpoints; // update ref if breakpoints change

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (!isMediaMatchSupported()) return false;
    return window.matchMedia(`(max-width: ${breakpointsRef.current.mobile}px)`).matches;
  });
  const [isTablet, setIsTablet] = useState<boolean>(() => {
    if (!isMediaMatchSupported()) return false;
    return window.matchMedia(
      `(min-width: ${breakpointsRef.current.mobile + 1}px) and (max-width: ${breakpointsRef.current.tablet}px)`,
    ).matches;
  });
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (!isMediaMatchSupported()) return false;
    return window.matchMedia(`(min-width: ${breakpointsRef.current.tablet + 1}px)`).matches;
  });
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | null>(() => {
    if (!isMediaMatchSupported() || !enableOrientation) return null;
    return window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape";
  });

  // Use MediaQueryList listeners for more efficient breakpoint tracking
  useEffect(() => {
    if (!isMediaMatchSupported()) return;

    // Create media queries for each breakpoint
    const mobileQuery = window.matchMedia(`(max-width: ${breakpointsRef.current.mobile}px)`);
    const tabletQuery = window.matchMedia(
      `(min-width: ${breakpointsRef.current.mobile + 1}px) and (max-width: ${breakpointsRef.current.tablet}px)`,
    );
    const desktopQuery = window.matchMedia(`(min-width: ${breakpointsRef.current.tablet + 1}px)`);
    const orientationQuery = enableOrientation
      ? window.matchMedia("(orientation: portrait)")
      : null;

    // Create debounced handler for media query changes
    const handleMediaChange = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setIsMobile(mobileQuery.matches);
        setIsTablet(tabletQuery.matches);
        setIsDesktop(desktopQuery.matches);
        if (enableOrientation && orientationQuery) {
          setOrientation(orientationQuery.matches ? "portrait" : "landscape");
        }
      }, debounceDelay);
    };

    // Add listeners using modern addEventListener API
    mobileQuery.addEventListener("change", handleMediaChange);
    tabletQuery.addEventListener("change", handleMediaChange);
    desktopQuery.addEventListener("change", handleMediaChange);
    if (orientationQuery) {
      orientationQuery.addEventListener("change", handleMediaChange);
    }

    // Cleanup listeners
    return () => {
      mobileQuery.removeEventListener("change", handleMediaChange);
      tabletQuery.removeEventListener("change", handleMediaChange);
      desktopQuery.removeEventListener("change", handleMediaChange);
      if (orientationQuery) {
        orientationQuery.removeEventListener("change", handleMediaChange);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [debounceDelay, enableOrientation]);

  return useMemo(
    () => ({ isMobile, isTablet, isDesktop, orientation }),
    [isMobile, isTablet, isDesktop, orientation],
  );
}
