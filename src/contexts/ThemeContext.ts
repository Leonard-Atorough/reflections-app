import React from "react";

export interface ThemeContextType {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});
