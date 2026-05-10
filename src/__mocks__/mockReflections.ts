import type { Reflection } from "../types/Reflection";

export function generateMockReflections(
  count: number,
  contentFormat: "plaintext" | "markdown" = "plaintext",
): Reflection[] {
  const reflections: Reflection[] = [];
  for (let i = 1; i <= count; i++) {
    reflections.push({
      id: `mock-id-${i}`,
      title: `Mock Reflection ${i}`,
      content: `This is the content of mock reflection number ${i}.`,
      contentFormat,
      dateCreated: 1759920501 + i * 1000,
      dateUpdated: 1759920501 + i * 1000,
    });
  }
  return reflections;
}
