import type { Reflection } from "../types/Reflection";

export const testReflection: Reflection = {
  id: "test-id-001",
  title: "Test Reflection Title",
  content: "This is a test reflection used across multiple components.",
  dateCreated: 1759920501,
  dateUpdated: 1759920501,
};

export const testReflections: Reflection[] = [testReflection];

export function generateMockReflections(count: number): Reflection[] {
  const reflections: Reflection[] = [];
  for (let i = 1; i <= count; i++) {
    reflections.push({
      id: `mock-id-${i}`,
      title: `Mock Reflection ${i}`,
      content: `This is the content of mock reflection number ${i}.`,
      dateCreated: 1759920501 + i * 1000,
      dateUpdated: 1759920501 + i * 1000,
    });
  }
  return reflections;
}
