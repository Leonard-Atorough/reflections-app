export type Reflection = {
  id: string;
  title: string;
  dateCreated: number;
  dateUpdated: number;
  content: string;
};

/**
 * Runtime validator for Reflection type
 * Ensures data integrity before state updates
 */
export function validateReflection(data: unknown): Reflection {
  if (data === null || typeof data !== "object") {
    throw new Error("Reflection must be an object");
  }

  const obj = data as Record<string, unknown>;

  // Validate id
  if (typeof obj.id !== "string" || obj.id.trim().length === 0) {
    throw new Error("Reflection.id must be a non-empty string");
  }

  // Validate title
  if (typeof obj.title !== "string" || obj.title.length === 0) {
    throw new Error("Reflection.title must be a non-empty string");
  }

  if (obj.title.length > 200) {
    throw new Error("Reflection.title must not exceed 200 characters");
  }

  // Validate dateCreated
  if (typeof obj.dateCreated !== "number" || obj.dateCreated <= 0) {
    throw new Error("Reflection.dateCreated must be a positive number (Unix timestamp)");
  }

  // Validate dateUpdated
  if (typeof obj.dateUpdated !== "number" || obj.dateUpdated <= 0) {
    throw new Error("Reflection.dateUpdated must be a positive number (Unix timestamp)");
  }

  // Validate content
  if (typeof obj.content !== "string") {
    throw new Error("Reflection.content must be a string");
  }

  if (obj.content.length > 50000) {
    throw new Error("Reflection.content must not exceed 50,000 characters");
  }

  return {
    id: obj.id,
    title: obj.title,
    dateCreated: obj.dateCreated,
    dateUpdated: obj.dateUpdated,
    content: obj.content,
  };
}

/**
 * Safe validator that returns null instead of throwing
 * Useful for conditional checks
 */
export function isValidReflection(data: unknown): data is Reflection {
  try {
    validateReflection(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Custom comparison function for ReflectionItem props
 * Prevents re-renders when parent list updates if this item hasn't changed
 * Compares the relevant properties: id, title, content, and dateUpdated
 */
export function arePropsEqual(
  prevProps: { reflection: Reflection },
  nextProps: { reflection: Reflection },
): boolean {
  return (
    prevProps.reflection.id === nextProps.reflection.id &&
    prevProps.reflection.title === nextProps.reflection.title &&
    prevProps.reflection.content === nextProps.reflection.content &&
    prevProps.reflection.dateUpdated === nextProps.reflection.dateUpdated
  );
}
