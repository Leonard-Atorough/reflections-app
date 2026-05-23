export interface Tag {
  name: string;
  color: TagColor;
}

export type TagColor = "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "gray";

export const tagColorMap: Record<TagColor, string> = {
  red: "#f44336",
  orange: "#ff9800",
  yellow: "#ffeb3b",
  green: "#4caf50",
  blue: "#2196f3",
  purple: "#9c27b0",
  pink: "#e91e63",
  gray: "#9e9e9e",
};
