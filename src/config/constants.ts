/**
 * Application configuration constants
 * Single source of truth for magic numbers and strings
 */

export const DEBOUNCE_DELAYS = {
  FORM_AUTO_SAVE: 500,
  SEARCH: 1000,
  STORAGE_PERSIST: 500,
  RESPONSIVE_RESIZE: 100,
} as const;

export const UI_LIMITS = {
  REFLECTION_TITLE_MAX: 200,
  REFLECTION_CONTENT_MAX: 50000,
  DAYS_UNTIL_OLD_REFLECTION: 6,
} as const;

export const SEARCH_DEFAULTS = {
  FIELDS: ["title"] as const,
  DEBOUNCE_MS: 1000,
} as const;

export const STORAGE_KEYS = {
  REFLECTIONS: "reflections",
} as const;

export const RESPONSIVE_BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 900,
  DESKTOP: 1200,
};
