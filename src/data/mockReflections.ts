import type { Reflection } from "../types/Reflection";

export const mockReflections: Reflection[] = [
  {
    id: "r1",
    title: "Understanding useEffect cleanup",
    dateCreated: "2025-09-01T09:15:00.000Z",
    dateUpdated: "2025-09-01T09:15:00.000Z",
    content: `
Today I finally internalized how cleanup functions work inside useEffect. I had been setting up intervals and subscriptions without realizing that failing to clean them up could lead to memory leaks and unexpected behavior, especially when components unmount or re-render frequently.

The key insight was that returning a function from useEffect isn't just optional—it's essential when you're dealing with side effects that persist beyond the initial render. I refactored a component that was leaking timers and immediately saw performance improvements.

This also made me think more deeply about lifecycle in React. Even though hooks abstract away the class component lifecycle methods, the underlying principles still apply. Cleanup is not just a technical requirement—it's a signal of thoughtful resource management.
    `.trim(),
  },
  {
    id: "r2",
    title: "Debugging Vitest matcher setup",
    dateCreated: "2025-09-02T18:42:00.000Z",
    dateUpdated: "2025-09-03T08:10:00.000Z",
    content: `
Spent way too long today trying to get jest-dom matchers working with Vitest. The issue turned out to be a subtle config inheritance problem—my test setup file wasn't properly extending the base config, so the matchers weren't being registered.

Once I isolated the problem, I created a reusable test harness that includes the correct setup and avoids duplication. I also added a debug log to confirm matcher availability during test runs, which helped me catch a missing import in one of the test files.

This experience reinforced the importance of understanding tooling defaults. Vitest is fast and powerful, but its configuration model is different from Jest, and assumptions don't always carry over. I’m documenting this in my debug journal so I don’t fall into the same trap again.
    `.trim(),
  },
  {
    id: "r3",
    title: "Refactoring with custom hooks",
    dateCreated: "2025-09-04T14:30:00.000Z",
    dateUpdated: "2025-09-04T14:30:00.000Z",
    content: `
I refactored a messy component today by extracting the localStorage logic into a custom hook. The result was cleaner, more readable, and easier to test. It also made me appreciate how hooks can encapsulate behavior without sacrificing composability.

The hook handles serialization, deserialization, and fallback defaults. I added a debounce mechanism to avoid excessive writes, and now I'm considering whether to expose a manual flush method for edge cases. This feels like a good candidate for reuse across multiple components.

What surprised me was how much cognitive load was lifted by moving logic out of the component. It’s not just about DRY code—it’s about clarity. When the component only cares about rendering and interaction, the mental model becomes simpler and easier to reason about.
    `.trim(),
  },
];
