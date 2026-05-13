import { useEffect, useState } from "react";

/**
 * Custom hook to manage light/dark theme with persistence in localStorage and system preference fallback.
 * @param defaultTheme Optional default theme ("light" or "dark") to use if no preference is stored.
 * @returns An object containing the current theme and a function to toggle the theme.
 */
export interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function useTheme(defaultTheme?: "light" | "dark"): ThemeState {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    if (defaultTheme) {
      localStorage.setItem("theme", defaultTheme);
      return defaultTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return { theme, toggleTheme };
}
