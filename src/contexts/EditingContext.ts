import React from "react";

export interface EditingContextType {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditingContext = React.createContext<EditingContextType>({
  isEditing: false,
  setIsEditing: () => {},
});
