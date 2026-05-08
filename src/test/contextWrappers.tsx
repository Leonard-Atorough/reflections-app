import React from "react";
import { EditingContext, ReflectionsContext, SidebarContext } from "@contexts";

/**
 * Helper to create context wrapper for tests
 * Reduces boilerplate in test files
 */
export function createContextWrapper() {
  return function ContextWrapper({ children }: { children: React.ReactNode }) {
    return (
      <EditingContext
        value={{
          isEditing: false,
          setIsEditing: vi.fn(),
        }}
      >
        <SidebarContext
          value={{
            isSidebarOpen: false,
            setIsSidebarOpen: vi.fn(),
          }}
        >
          <ReflectionsContext
            value={{
              reflections: [],
              selectedId: null,
              dispatch: vi.fn(),
            }}
          >
            {children}
          </ReflectionsContext>
        </SidebarContext>
      </EditingContext>
    );
  };
}
