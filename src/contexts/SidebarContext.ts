import React from "react";

export interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarContext = React.createContext<SidebarContextType>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
});