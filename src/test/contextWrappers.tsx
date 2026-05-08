import React from "react";
import { EditingContext, ReflectionsContext, SidebarContext } from "@contexts";
import type { Reflection } from "@/types/Reflection";

interface ContextWrapperOptions {
  reflections?: Reflection[];
  selectedId?: string | null;
  isEditing?: boolean;
  isSidebarOpen?: boolean;
}

/**
 * Helper to create context wrapper for tests
 * Reduces boilerplate in test files
 *
 * @param options Optional customization for context values
 * @returns A wrapper component that provides the contexts
 *
 * @example
 * const wrapper = createContextWrapper({
 *   reflections: mockReflections,
 *   selectedId: mockReflections[0].id,
 * });
 * const { result } = renderHook(() => useSelectedReflection(), { wrapper });
 */
export function createContextWrapper(options: ContextWrapperOptions = {}) {
  const { reflections = [], selectedId = null, isEditing = false, isSidebarOpen = false } = options;

  return function ContextWrapper({ children }: { children: React.ReactNode }) {
    return (
      <EditingContext
        value={{
          isEditing,
          setIsEditing: vi.fn(),
        }}
      >
        <SidebarContext
          value={{
            isSidebarOpen,
            setIsSidebarOpen: vi.fn(),
          }}
        >
          <ReflectionsContext
            value={{
              reflections,
              selectedId,
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
