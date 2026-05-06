import React from "react";

export interface UIContextType {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarVisible: boolean;
  setSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UIContext = React.createContext<UIContextType>({
  isEditing: false,
  setIsEditing: () => {},
  sidebarVisible: false,
  setSidebarVisible: () => {},
});
