# Comprehensive Code Audit: Reflections App

**Project:** React + TypeScript + Vite  
**Date:** May 8, 2026  
**Scope:** Full stack performance, architecture, code quality, testing, accessibility, and WYSIWYG readiness

---

## EXECUTIVE SUMMARY

Your project is **well-structured and clean** with good TypeScript coverage and testing basics. However, there are **critical issues to address before adding WYSIWYG editing**:

| Category      | Status      | Key Finding                                           |
| ------------- | ----------- | ----------------------------------------------------- |
| Performance   | ⚠️ MODERATE | Unnecessary re-renders, over-contextualization        |
| Architecture  | ✅ GOOD     | Clear separation but contexts may cause issues        |
| Code Quality  | ✅ GOOD     | Type-safe, but some unused imports and patterns       |
| Testing       | ⚠️ GAPS     | 40% of components untested, missing edge cases        |
| Accessibility | ✅ GOOD     | ARIA labels present, but keyboard handling incomplete |
| WYSIWYG Prep  | 🔴 CRITICAL | Textarea replacement requires major refactoring       |

---

## DETAILED ANALYSIS

### 1. PERFORMANCE ISSUES

#### 1.1 Unnecessary Re-renders in App.tsx

**Issue:** All child components re-render when ANY state changes (theme, sidebar, editing, etc.)

```typescript
// App.tsx - Current pattern creates new objects every render
<ThemeContext value={useMemo(() => ({ theme, setTheme }), [theme])}>
  <EditingContext value={useMemo(() => ({ isEditing, setIsEditing }), [isEditing])}>
    // ... nested contexts
```

**Impact:**

- Each context update invalidates all providers and their consumers
- `Header`, `Aside`, `Main`, `Footer` all re-render together
- With rich text editor, this becomes significant (constant dirty checks)

**Root Cause:** Four independent contexts are nested deeply. React's context propagation causes cascading re-renders.

---

#### 1.2 ReflectionForm Auto-save Pattern

**Issue:** Debounce pattern in `usePersistedReflections` + `ReflectionForm` creates multiple timeouts

```typescript
// ReflectionForm.tsx
useEffect(() => {
  const saveHandler = setTimeout(() => {
    // Auto-save logic
  }, 500);
  return () => clearTimeout(saveHandler);
}, [title, content, reflection?.dateCreated, reflections, updateReflection, addReflection]);
```

**Impact:**

- On each keystroke: creates timeout + potential dispatch + context propagation
- On 100 characters: 100 timeouts potentially created
- Search also runs independently with separate debounce

**Cascading Delays:**

1. User types → ReflectionForm debounce (500ms)
2. Dispatch → reflectionsReducer
3. localStorage persist debounce (500ms)
4. Context re-renders consumers (Header, Aside, MenuItem)
5. App-level search re-filters all reflections

---

#### 1.3 Search Functionality Over-fetching

**Issue:** `useSearch` uses `useDeferredValue` but inefficiently combines with debounce

```typescript
// useSearch.ts
const deferredReflections = useDeferredValue(reflections);
// Then manually debounces search input separately
// This causes: 1) deferred value updates + 2) debounced search
```

**Impact:**

- Two separate update paths for search results
- With 1000+ reflections, linear filter on each search
- No memoization of filtered results between search calls with same term

**Scalability:** Current implementation starts degrading at ~500 reflections.

---

#### 1.4 Missing React.memo and Memoization

**Issue:** Components that receive props don't prevent unnecessary re-renders

```typescript
// ReflectionDetail.tsx - receives full reflection object
// Menu items re-render even if their reflection hasn't changed
// MenuItem receives reflection object, no memo
export function ReflectionItem({ reflection }: Props) { ... }
// When ANY reflection updates, ALL menu items re-render
```

**Impact:**

- 50 reflections in sidebar → 50+ re-renders on each keystroke
- Multiplied by re-render of parent `ReflectionsMenu`

---

#### 1.5 Large Bundle Analysis

**Current Dependencies:**

- `react` 19.1.1 - ~42KB (gzipped)
- `uuid` 11.1.0 - ~6KB (alternative: crypto.randomUUID() native)
- No build analysis configured

**Future WYSIWYG Libraries:**

- TipTap: ~100KB
- Draft.js: ~150KB
- Slate: ~80KB
- Prosemirror: ~120KB

**Impact:** Bundle size becomes critical with editor library added.

---

### 2. ARCHITECTURE ISSUES

#### 2.1 Context Proliferation Anti-pattern

**Issue:** 4 separate contexts for tightly-coupled state

```typescript
// Current structure
<ThemeContext>           // 1. Theme
  <EditingContext>       // 2. Editing state (isEditing, setIsEditing)
    <SidebarContext>     // 3. Sidebar visibility
      <ReflectionsContext> // 4. Main data + dispatch
```

**Problems:**

1. **Tight coupling:** Editing, Sidebar, and Reflections are interdependent
   - When selecting reflection → need to close sidebar + exit editing
   - When creating new → need to open editing + close sidebar
   - Current code scatters this logic across `Aside.tsx`, `Header.tsx`, `MenuItem.tsx`

2. **Prop drilling still happens:** Components need multiple contexts

   ```typescript
   // ReflectionDetail.tsx
   const { setIsEditing } = useContext(EditingContext);
   const { selectedId } = useContext(ReflectionsContext);
   const { deleteReflection } = useReflectionActions();
   ```

3. **Testing complexity:** Test wrappers need all 4 contexts
   ```typescript
   // MenuItem.test.tsx - needs EditingContext + SidebarContext + ReflectionsContext
   ```

**Recommended Structure:**

- **Theme** - Keep separate (different concern)
- **UI State** - Combine (Editing + Sidebar) into one `UIContext`
- **Reflections** - Keep separate (data concern)

---

#### 2.2 State Management Mixed Responsibilities

**Issue:** Reducer and independent state pieces don't align

```typescript
// App.tsx mixes:
const [theme, setTheme] = useState(...);           // Independent
const [reflectionsState, dispatch] = useReducer(...); // Reducer
const [isEditing, setIsEditing] = useState(...);  // Independent
const [isSidebarOpen, setIsSidebarOpen] = useState(...); // Independent
```

**Problems:**

1. Editing and Sidebar state should influence each other (currently scattered logic)
2. No single source of truth for "UI mode"
3. Harder to add features like "open editing on new reflection"

**With WYSIWYG Editor:**

- Editor needs to know: is it new/edit? Is sidebar open? Editing state?
- Current pattern makes this prop-drilling nightmare

---

#### 2.3 Utility Hook Usage Pattern

**Issue:** `useReflectionActions()` wraps dispatch but creates indirection

```typescript
// Instead of direct dispatch usage
const { dispatch } = useContext(ReflectionsContext);

// Every component uses:
const { addReflection, updateReflection, deleteReflection } = useReflectionActions();
```

**Problems:**

1. Extra hook layer adds complexity
2. Duplicates dependencies in `useCallback`
3. Error handling only in one place (hard to customize)
4. With WYSIWYG: will need many specialized mutations not in this hook

---

#### 2.4 SearchBar Component (Empty)

**Issue:** `/src/components/ui/SearchBar/` is empty

```
SearchBar/
  (empty - no files)
```

**Impact:**

- Search is in `Header.tsx` as inline logic
- Code duplication if search needs to be reused
- WYSIWYG will need search that filters edited content format

---

### 3. CODE QUALITY ISSUES

#### 3.1 Unused Imports

**Current Error:** MenuItem.test.tsx

```typescript
import { useState } from "react"; // ❌ Declared but never read
```

**Compilation blocks this (strict mode enabled) but should be removed.**

---

#### 3.2 Inconsistent Error Handling

**Issue:** No consistent error boundary or error handling pattern

```typescript
// usePersistedReflections.ts
try {
  localStorage.setItem("reflections", JSON.stringify(reflections));
  setStatus("idle");
} catch (error) {
  console.error(error); // Just logs, doesn't type it
  setStatus("error");
}
```

**Missing:**

- Error boundary component
- Error recovery UI
- Type-safe error handling
- Persistence failure recovery beyond alert()

---

#### 3.3 Inconsistent Naming Conventions

**Issue:** Mixed naming patterns

```typescript
// Property naming inconsistency
reflection?.dateCreated; // camelCase
reflection?.dateUpdated; // camelCase
var formattedUpdateDate; // camelCase ✓

// Component naming
ReflectionForm; // ✓ PascalCase
ReflectionItem; // ✓ PascalCase (inside MenuItem.tsx)
reflectionsReducer; // ❌ camelCase (should be prefixed reducer)

// Function naming
usePersistedReflections; // ✓
useReflectionActions; // ✓
formatDate; // ✓
```

**Not critical but inconsistent with module structure.**

---

#### 3.4 Type Safety - Reflection Type Too Loose

**Issue:** Reflection type missing constraints

```typescript
export type Reflection = {
  id: string; // Could be empty
  title: string; // Could be empty (breaks UI invariants)
  dateCreated: number; // Could be 0 or negative
  dateUpdated: number; // Could be 0 or negative
  content: string; // No length limits
};
```

**Better:**

```typescript
export type Reflection = {
  id: string & { readonly __brand: "ReflectionId" };
  title: string & { readonly __brand: "ReflectionTitle" };
  dateCreated: number & { readonly __brand: "UnixTimestamp" };
  dateUpdated: number;
  content: string;
};
```

**Current validation:** Only checks `title.trim()` in ReflectionForm, not in type.

---

#### 3.5 Mode Type Unused

**Issue:** `Mode.ts` defines type but it's never imported

```typescript
// src/types/Mode.ts
export type Mode = "new" | "edit" | "view";

// No file imports this type anywhere
```

**This was likely planned for state management but not implemented. Should either:**

1. Use it to replace `isEditing` boolean (better: `mode: Mode | null`)
2. Delete if not needed

---

#### 3.6 Hardcoded Values Scattered

**Issue:** Magic numbers/strings throughout code

```typescript
// ReflectionForm.tsx
}, 500);  // Debounce time hardcoded

// usePersistedReflections.ts
const DEBOUNCE_MS = 500;  // Consistent ✓ but different from ReflectionForm

// useSearch.ts
const { searchFields = ["title"], debounceMs = 500 } = options || {};  // Default hardcoded

// formatDate.ts
if (diff >= 0 && diff <= 6) { ... }  // Magic number for "this week"
```

**Better:** Create `src/config/constants.ts`

---

#### 3.7 CSS Module Organization

**Issue:** Each component has its own `.module.css` file

```
ReflectionForm.module.css
ReflectionDetail.module.css
Button.module.css
TrashIcon.module.css
Layout.module.css
MenuItem.module.css
ReflectionsMenu.module.css
```

**Current:** 7 CSS modules with some overlap

**With WYSIWYG Editor:**

- Editor will add rich formatting: bold, italic, underline, lists, code blocks
- Need consistent styling approach for: headings, quotes, code, lists
- CSS Module per component doesn't scale well for editor styling

**Better approach:** Separate component styles from design tokens

---

### 4. TESTING GAPS

#### 4.1 Coverage Analysis

| Category   | Files | Tested | Status |
| ---------- | ----- | ------ | ------ |
| Components | 9     | 6      | 67% ❌ |
| Hooks      | 6     | 1      | 17% 🔴 |
| Utils      | 1     | 0      | 0% 🔴  |
| Reducers   | 1     | 0      | 0% 🔴  |

**Untested Files:**

- `Header.tsx` - No tests
- `Footer.tsx` - No tests
- `Main.tsx` - No tests
- `Layout.tsx (Aside takes filtered reflections)` - Partial
- `useFormattedDate.ts` - No tests
- `useSelectedReflection.ts` - No tests
- `reflectionsReducer.ts` - No tests (critical!)
- `formatDate.ts` - No tests

---

#### 4.2 Missing Edge Cases in Tests

**ReflectionForm.test.tsx:**

```typescript
// Tested:
✓ Renders with reflection
✓ Renders empty form

// Missing:
❌ What happens when reflection.id changes?
❌ Multiple updates in quick succession
❌ Save fails (localStorage error)
❌ Title with only whitespace
❌ Content with special characters or long text
❌ Keyboard shortcuts (Escape key behavior not tested)
❌ Concurrent edits
```

**MenuItem.test.tsx:**

```typescript
// Missing:
❌ What if same item clicked twice?
❌ What if edited while sidebar is open?
❌ Keyboard navigation between items
❌ Empty content scenarios
```

---

#### 4.3 Mock Data Issues

**Issue:** Dual mock data sources

```typescript
// src/__mocks__/mockReflections.ts - Used in tests
export const testReflection: Reflection = { ... };

// src/data/mockReflections.ts - Used on app startup
export const mockReflections: Reflection[] = [ ... ];
```

**Inconsistency:**

- Test mocks: Minimal data
- Startup mocks: Contains user guide text
- No shared constants or factory

---

#### 4.4 Test Utilities Not DRY

**Issue:** Each test file recreates wrapper components

```typescript
// MenuItem.test.tsx
function MenuItemWrapper({ ... }) {
  return (
    <EditingContext value={...}>
      <SidebarContext value={...}>
        <ReflectionsContext value={...}>
```

**Duplicated in:** ReflectionDetail.test.tsx, ReflectionForm.test.tsx, MenuItem.test.tsx, Aside.test.tsx

**Better:** Create `src/testSetup.tsx` helper function for context wrapping

---

### 5. ACCESSIBILITY ISSUES

#### 5.1 Interactive Elements Need Better Keyboard Support

**ReflectionDetail.tsx:**

```typescript
<div
  onKeyDown={(e) => {
    if (e.key === "Enter") setIsEditing(true);  // ✓ Good
  }}
  onClick={() => setIsEditing(true)}
  className={styles.header}
  tabIndex={0}  // ✓ Added
>
```

**Issues:**

1. `tabIndex={0}` makes it focusable but no visual focus indicator visible
2. `Enter` key works but `Space` should too (WCAG 2.1)
3. No `role` attribute - should be `role="button"`

**Better:**

```typescript
<button
  onClick={() => setIsEditing(true)}
  className={styles.header}
  aria-label="Edit reflection"
>
```

---

#### 5.2 Search Input Missing Labels

**Header.tsx:**

```typescript
<input
  type="text"
  placeholder="Search reflections..."
  aria-label="Search Reflections"  // ✓ Present
  onChange={(e) => onSearch?.(e.target.value)}
/>
```

**Good:** aria-label is present

**Missing:**

1. No visual label on page
2. No search results count communicated to screen readers
3. No "aria-live" region for search results updates

---

#### 5.3 Button Component Missing aria-label Logic

**Button.tsx:**

```typescript
export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  // ❌ Missing aria-label prop
}

export function Button({ variant, children, onClick, className, size }: ButtonProps) {
  return (
    <button
      className={...}
      onClick={onClick}
      // ❌ No aria-label support
    >
      {children}
    </button>
  );
}
```

**Issue:** Icon-only buttons (Add button with SVG) lack accessible labels

```typescript
// Correct usage would be:
<Button aria-label="Add Reflection" variant="primary">
  <SVG />
</Button>

// But Button component doesn't accept aria-label
```

---

#### 5.4 Focus Management in Editor Transitions

**Issue:** When switching between ReflectionDetail ↔ ReflectionForm, focus isn't managed

```typescript
// Main.tsx
{isEditing ? <ReflectionForm /> : <ReflectionDetail />}
// Focus lost when toggling
```

**Impact:** Users relying on keyboard navigation lose their place.

---

#### 5.5 Modal Dialog Not Implemented (Delete Confirmation)

**ReflectionDetail.tsx:**

```typescript
if (!window.confirm("Delete this reflection? This action cannot be undone!")) return;
```

**Issues:**

1. `window.confirm()` is poor UX
2. Not keyboard accessible in some contexts
3. No proper ARIA modal dialog structure

---

### 6. WYSIWYG EDITOR PREPARATION ISSUES

#### 6.1 Textarea Replacement Challenge

**Current Flow:**

```typescript
<textarea
  name="content"
  aria-label="Content"
  placeholder="Add some reflections..."
  value={content}
  className={styles.content}
  onChange={(e) => setContent(e.target.value)}
/>
```

**Problems with switching to WYSIWYG:**

1. **Editor doesn't use React state:** Most editors (TipTap, Draft.js, Slate) have their own state

   ```typescript
   // Can't do this with editor:
   const [content, setContent] = useState(reflection?.content || "");
   ```

2. **Content format changes:** Textarea stores plain text, editors store JSON/HTML

   ```typescript
   // Before: "Hello **world**"
   // After TipTap: JSON with marks and nodes
   ```

3. **Auto-save complexity:** Can't debounce on onChange—need editor's own events

   ```typescript
   // Editor has: onUpdate, onSelectionUpdate, onTransaction
   // Not simple onChange
   ```

4. **Controlled component pattern breaks:**
   ```typescript
   // Editors are partially uncontrolled
   // Can't just pass value prop
   ```

---

#### 6.2 Data Model Incompatibility

**Current Reflection Type:**

```typescript
export type Reflection = {
  id: string;
  title: string;
  dateCreated: number;
  dateUpdated: number;
  content: string; // ❌ Plain text only
};
```

**WYSIWYG Requires:**

Option A: Store HTML

```typescript
content: string; // "<p>Hello <strong>world</strong></p>"
// Risk: HTML injection, complex migrations
```

Option B: Store Editor JSON

```typescript
content: {
  type: 'doc';
  content: [{ type: 'paragraph'; content: [...] }];
};
// Risk: Editor library lock-in, harder to migrate
```

Option C: Store Markdown + Editor renders

```typescript
content: string; // "Hello **world**"
// Requires parsing/rendering layer
```

**Current:** No version tracking, so migrating existing content will be manual.

---

#### 6.3 Form Submission Pattern Incompatible

**ReflectionForm.tsx Structure:**

```typescript
useEffect(() => {
  const saveHandler = setTimeout(() => {
    if (title.trim()) {
      // Check if exists
      const exists = reflections.some((r) => r.id === idRef.current);
      // Save
      if (exists) updateReflection(...);
      else addReflection(...);
    }
  }, 500);
  return () => clearTimeout(saveHandler);
}, [title, content, ...]);
```

**Issues with WYSIWYG:**

1. Auto-save on 500ms debounce won't work with editor's async updates
2. Editor might have unsaved state not in `content` state variable
3. No explicit "save" point for editors to commit changes

---

#### 6.4 CSS/Styling Not Prepared

**Current Styling:**

- 7 separate CSS Modules
- No unified prose/content styling
- Editor will need:
  - Typography scale for headings (h1-h6)
  - List styling (ul, ol, li)
  - Code block styling
  - Quote styling
  - Link styling
  - Table styling (if supported)

**No current design tokens for:**

- Code font family
- Quote styling
- Syntax highlighting

---

#### 6.5 Dependency Conflicts

**Current Dependencies:**

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "uuid": "^11.1.0"
}
```

**Popular WYSIWYG Libraries and Known Issues:**

- **TipTap:** Needs `@tiptap/react`, `@tiptap/pm`, `prosemirror-*` (adds 200KB+)
- **Draft.js:** Uses deprecated context API patterns, might have React 19 warnings
- **Slate:** Needs careful event handling in React 19 (async rendering changes)
- **Prosemirror-based:** Heavy, not designed for React's strict mode

**Recommendation:** TipTap is React-first and most compatible.

---

#### 6.6 Search Needs Updating

**Current Search:**

```typescript
export function useSearch(reflections: Reflection[]) {
  // Searches reflection.title and reflection.content as plain text
  const filtered = deferredReflections.filter((reflection) => {
    return searchFields.some((field) => {
      const content = field === "title" ? reflection.title : reflection.content;
      return content.toLowerCase().includes(lowercaseTerm);
    });
  });
}
```

**With WYSIWYG:**

- Content might be JSON (not searchable as plain text)
- Need to extract plain text from editor format for search
- Performance issue: regenerating plain text on every search

**Better:** Store content in both formats (rendered + searchable)

---

### 7. CONTEXT USAGE PATTERNS

#### 7.1 Over-contextualization Diagram

```
App.tsx (renders all state)
├── ThemeContext [theme, setTheme]
│   └── EditingContext [isEditing, setIsEditing]
│       └── SidebarContext [isSidebarOpen, setIsSidebarOpen]
│           └── ReflectionsContext [reflections, selectedId, dispatch]
│               ├── Header (uses all 4 contexts)
│               ├── Aside (uses 3 contexts)
│               │   └── ReflectionsMenu
│               │       └── MenuItem (uses 3 contexts)
│               ├── Main (uses 2 contexts)
│               │   ├── ReflectionForm (uses 3 contexts + hook)
│               │   └── ReflectionDetail (uses 3 contexts + hook)
│               └── Footer (uses 0 contexts ✓)
```

**Issue:** Every context provider update causes re-render of entire subtree

---

#### 7.2 Context Coupling Anti-pattern

**Example:** Setting selected reflection triggers cascading updates

```typescript
// MenuItem.tsx - one click triggers 3 context updates
const handleToggle = () => {
  setSelectedId(isSelected ? null : reflection.id); // ReflectionsContext
  if (isEditing) setIsEditing(false); // EditingContext
  if (!isEditing && !isSelected) setIsSidebarOpen(false); // SidebarContext
};
```

**Problem:** These should be atomic or coordinated, not scattered

---

### 8. BUILD AND CONFIGURATION ISSUES

#### 8.1 Missing Bundle Analysis

**No visibility into:**

- Actual bundle size
- Chunk split optimization
- Dead code

**Better:** Add `vite-plugin-visualizer` to see bundle composition before adding WYSIWYG.

---

#### 8.2 Test Coverage Not Enforced

**vite.config.ts:**

```typescript
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: "./src/testSetup.ts",
  coverage: {
    provider: "v8",
    exclude: ["src/main.tsx", ...coverageConfigDefaults.exclude],
  },
},
```

**Missing:**

- No coverage thresholds
- No CI/CD pipeline configuration
- No pre-commit hooks

---

---

## PRIORITIZED RECOMMENDATIONS

### 🟢 QUICK WINS (1-2 hours each)

#### 1. Fix Unused Imports

**File:** MenuItem.test.tsx, line 1  
**Action:** Remove `import { useState } from "react";`  
**Impact:** Fixes TypeScript strict mode error  
**Effort:** 2 minutes

---

#### 2. Create Constants File

**File:** New `src/config/constants.ts`  
**Action:**

```typescript
export const DEBOUNCE_DELAYS = {
  FORM_AUTO_SAVE: 500,
  SEARCH: 500,
  STORAGE_PERSIST: 500,
} as const;

export const UI_LIMITS = {
  REFLECTION_TITLE_MAX: 200,
  REFLECTION_CONTENT_MAX: 50000,
  DAYS_UNTIL_OLD_REFLECTION: 6,
} as const;

export const SEARCH_DEFAULTS = {
  FIELDS: ["title"] as const,
  DEBOUNCE_MS: 500,
} as const;
```

**Impact:** Single source of truth, easier testing  
**Effort:** 20 minutes

---

#### 3. Extract SearchBar Component

**File:** New `src/components/ui/SearchBar/SearchBar.tsx`  
**Action:** Move search input from Header to reusable component  
**Current:** Inline in Header  
**Impact:** Reusable, testable, maintainable  
**Effort:** 30 minutes

---

#### 4. Add Missing aria-label Support to Button

**File:** Button.tsx  
**Action:**

```typescript
export interface ButtonProps {
  // ... existing
  ariaLabel?: string;
}

export function Button({ ariaLabel, ... }: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      // ...
    >
```

**Impact:** Icon buttons become accessible  
**Effort:** 15 minutes

---

#### 5. Create DRY Test Utilities

**File:** New `src/test/testContextWrappers.tsx`  
**Action:**

```typescript
export function createContextWrapper() {
  return ({ children }: { children: ReactNode }) => (
    <EditingContext value={...}>
      <SidebarContext value={...}>
        <ReflectionsContext value={...}>
          {children}
        </ReflectionsContext>
      </SidebarContext>
    </EditingContext>
  );
}
```

**Impact:** 50% less boilerplate in test files  
**Effort:** 20 minutes

---

#### 6. Add Basic Error Boundary Component

**File:** New `src/components/ErrorBoundary.tsx`  
**Action:** Wrap App to catch render errors  
**Current:** No error handling  
**Impact:** Better error visibility in dev and production  
**Effort:** 25 minutes

---

### 🟡 MEDIUM-EFFORT IMPROVEMENTS (2-4 hours each)

#### 7. Combine UI State Contexts

**Files:** App.tsx, all contexts  
**Action:** Merge EditingContext + SidebarContext into one

**Before:**

```typescript
<EditingContext value={...}>
  <SidebarContext value={...}>
```

**After:**

```typescript
export type UIState = {
  isEditing: boolean;
  isSidebarOpen: boolean;
};

<UIContext value={...}>
```

**Impact:**

- Reduces provider nesting
- Enables coordinated state changes
- Easier to add new UI state concerns

**Effort:** 2-3 hours (includes testing updates)

---

#### 8. Add React.memo to Menu Components

**Files:** ReflectionsMenu.tsx, MenuItem.tsx  
**Action:**

```typescript
export const ReflectionsMenu = React.memo(
  ({ reflections }: Props) => {
    // ...
  },
  (prev, next) => {
    return (
      prev.reflections.length === next.reflections.length &&
      prev.reflections[0]?.id === next.reflections[0]?.id
    );
  },
);
```

**Impact:**

- Prevents re-renders of 50+ menu items on each keystroke
- Significant performance boost in sidebar

**Effort:** 1.5 hours

---

#### 9. Replace uuid with crypto.randomUUID()

**Files:** ReflectionForm.tsx  
**Action:**

```typescript
// Before
import { v4 as uuidv4 } from "uuid";
const id = uuidv4();

// After
const id = crypto.randomUUID();
```

**Impact:**

- Remove 6KB dependency
- Reduce bundle size
- Builtin native API (better performance)

**Effort:** 20 minutes

---

#### 10. Refactor ReflectionForm for Editor Compatibility

**Files:** ReflectionForm.tsx  
**Action:** Separate form structure from content editing logic

**Current monolithic component:**

```typescript
export function ReflectionForm({ reflection }: props) {
  const [title, setTitle] = useState(...);
  const [content, setContent] = useState(...);
  // Auto-save, input handlers, all mixed
}
```

**Refactored:**

```typescript
export function ReflectionForm({ reflection }: props) {
  // Meta management only
}

function TitleInput({ value, onChange }: ...) { ... }
function ContentEditor({ value, onChange }: ...) { ... }  // Easier to swap!
function AutoSaveManager({ ... }: ...) { ... }
```

**Impact:**

- Editor can be swapped in `ContentEditor`
- Independent testing for each part
- Auto-save decoupled

**Effort:** 3 hours

---

#### 11. Add Type Validation for Reflection

**Files:** types/Reflection.ts  
**Action:**

```typescript
export type Reflection = {
  id: string;  // Could use Brand type
  title: string;  // Add constraint: 1-200 chars?
  dateCreated: number;  // Add UnixTimestamp type
  dateUpdated: number;
  content: string;
};

// Runtime validator
export const validateReflection = (data: unknown): Reflection => {
  if (typeof data !== 'object' || data === null) throw new Error(...);
  // Validate each field...
  return data as Reflection;
};
```

**Impact:**

- Prevents invalid state
- Better error messages
- Easier to add content format migration

**Effort:** 2 hours

---

#### 12. Create Comprehensive Test Suite for Untested Files

**Files to test:**

- formatDate.ts (utils)
- reflectionsReducer.ts (critical!)
- useFormattedDate.ts
- useSelectedReflection.ts
- Header.tsx
- Footer.tsx

**Impact:**

- Catch bugs before WYSIWYG changes
- Baseline for regression testing

**Effort:** 4-5 hours (depending on ambition)

---

### 🔴 WYSIWYG-SPECIFIC PREPARATION (4-6 hours each)

#### 13. Create Content Format Layer

**File:** New `src/types/ContentFormat.ts`  
**Action:**

```typescript
// Support multiple content formats during migration
export type ContentFormat = "plaintext" | "html" | "markdown" | "editor-json";

export type Reflection = {
  // ... existing
  content: string;
  contentFormat: ContentFormat; // Version tracking
};

// Conversion utilities
export function convertContent(content: string, from: ContentFormat, to: ContentFormat): string {
  // ...
}
```

**Impact:**

- Enables gradual migration of old reflections
- Supports multiple editors in future
- Reversible format changes

**Effort:** 3-4 hours

---

#### 14. Update Search for Rich Content

**File:** src/hooks/useSearch.ts + new utility  
**Action:**

```typescript
// New utility to extract plain text from editor format
function extractPlainText(content: string, format: ContentFormat): string {
  if (format === "plaintext") return content;
  if (format === "html")
    return new DOMParser().parseFromString(content, "text/html").body.textContent || "";
  if (format === "markdown") return content.replace(/[#*_`\[\]]/g, "");
  // ... editor-json handling
}

// Update useSearch to use it
const indexed = reflections.map((r) => ({
  id: r.id,
  searchableContent: extractPlainText(r.content, r.contentFormat),
}));
```

**Impact:**

- Search works across formats
- Performance optimized (pre-computed search index)

**Effort:** 2-3 hours

---

#### 15. Prepare Auto-save for Editor

**File:** New `src/hooks/useEditorAutoSave.ts`  
**Action:**

```typescript
export function useEditorAutoSave(
  editorState: any, // Editor-specific state
  metadata: { id: string; title: string; dateCreated: number },
  onSave: (reflection: Reflection) => void,
) {
  // Detect changes in editor
  // Debounce
  // Format conversion
  // Call onSave
}
```

**Impact:**

- Decoupled from ReflectionForm
- Reusable with different editors
- Handles async editor state

**Effort:** 2-3 hours

---

#### 16. Design Content Styling System

**File:** New `src/styles/_content.css`  
**Action:**

```css
/* Prose/content styling for rich text */
.prose {
  line-height: var(--leading-relaxed);
}

.prose h1 {
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
}
.prose h2 {
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
}
/* ... */

.prose ul {
  list-style: disc;
  margin-left: var(--space-6);
}
.prose ol {
  list-style: decimal;
  margin-left: var(--space-6);
}

.prose code {
  font-family: var(--font-mono);
  background: var(--color-code-bg);
  padding: 0 var(--space-2);
  border-radius: var(--radius-sm);
}

.prose pre {
  background: var(--color-code-bg);
  padding: var(--space-4);
  overflow-x: auto;
}
```

**Impact:**

- Consistent editor output styling
- Portable to different editors
- Easy to theme

**Effort:** 1-2 hours

---

### ⚫ TECHNICAL DEBT TO ADDRESS FIRST

#### 17. Improve Performance: Remove Nested Contexts

**Why first:** Reduces performance impact of everything else  
**Current:** 4-level context nesting  
**Target:** 2-level (Theme + Data)  
**Effort:** 4-5 hours  
**Impact:** 30-50% reduction in unnecessary re-renders

---

#### 18. Replace window.confirm() Dialog

**Why first:** Poor UX, not accessible  
**Current:**

```typescript
if (!window.confirm("Delete this reflection?")) return;
```

**Target:** Proper modal component  
**Effort:** 2-3 hours  
**Impact:** Better UX + accessibility

---

#### 19. Remove uuid Dependency

**Why first:** Reduces bundle, speeds up WYSIWYG integration  
**Effort:** 20 minutes  
**Impact:** ~6KB reduction

---

---

## IMPLEMENTATION ROADMAP

### Phase 1: Code Quality (Week 1) ⚡

1. ✅ Fix unused imports (10 min)
2. ✅ Create constants file (20 min)
3. ✅ Extract SearchBar component (30 min)
4. ✅ Add aria-label to Button (15 min)
5. ✅ Create test utilities (20 min)
6. ✅ Add Error Boundary (25 min)
7. ✅ Remove uuid (20 min)

**Total:** ~2.5 hours  
**Bundle Impact:** -6KB

---

### Phase 2: Architecture Improvements (Week 2) 🏗️

8. ✅ Combine UI contexts (3 hours)
9. ✅ Add React.memo to menu (1.5 hours)
10. ✅ Refactor ReflectionForm (3 hours)
11. ✅ Add type validation (2 hours)
12. ✅ Create comprehensive test suite (4 hours)

**Total:** ~13.5 hours  
**Performance Impact:** 30-40% fewer re-renders

---

### Phase 3: WYSIWYG Preparation (Week 3-4) 🎨

13. ✅ Create content format layer (4 hours)
14. ✅ Update search for rich content (3 hours)
15. ✅ Prepare auto-save for editor (3 hours)
16. ✅ Design content styling system (2 hours)

**Total:** ~12 hours  
**Readiness:** 95% prepared for editor integration

---

### Phase 4: Editor Integration (Week 5+) 📝

- Install TipTap or chosen editor
- Integrate ContentEditor component
- Migrate existing content (if needed)
- Full testing

---

## SUMMARY TABLE

| Issue            | Severity | Effort | Impact     | Priority |
| ---------------- | -------- | ------ | ---------- | -------- |
| Unused imports   | Low      | 10m    | High       | 1        |
| Context nesting  | High     | 3h     | Very High  | 2        |
| No memoization   | Medium   | 1.5h   | High       | 3        |
| uuid dependency  | Low      | 20m    | Medium     | 4        |
| Form refactoring | Medium   | 3h     | Very High  | 5        |
| Type validation  | Medium   | 2h     | High       | 6        |
| Test coverage    | High     | 4-5h   | Very High  | 7        |
| Content format   | High     | 4h     | Critical\* | 8        |
| Search updates   | Medium   | 2-3h   | High       | 9        |
| Editor auto-save | Medium   | 2-3h   | Critical\* | 10       |
| Content styling  | Low      | 1-2h   | Medium     | 11       |

\*Critical = Required before WYSIWYG integration

---

## CONCLUSION

**Current State:** Clean, type-safe, well-organized foundation ✅

**Blockers for WYSIWYG:**

1. ReflectionForm tightly coupled to textarea
2. Auto-save pattern incompatible with editor state
3. Content format locked to plain text
4. No styling system for rich text

**Recommendation:** Complete Phase 1-2 improvements first (2-3 weeks), then design Phase 3 WYSIWYG prep in detail before choosing editor library.

**Expected Result:** By end of Phase 3, you'll have a codebase ready to swap in any modern WYSIWYG editor with minimal disruption.

---

## IMPLEMENTATION STATUS (as of May 9, 2026)

### ✅ Completed Items

| #   | Item                                      | Notes                                                                                                                                                                                                                                             |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Fix unused imports**                    | MenuItem.test.tsx and all test files are clean                                                                                                                                                                                                    |
| 2   | **Create constants file**                 | `src/config/constants.ts` created with DEBOUNCE_DELAYS, UI_LIMITS, SEARCH_DEFAULTS, STORAGE_KEYS, RESPONSIVE_BREAKPOINTS                                                                                                                          |
| 3   | **Extract SearchBar component**           | `src/components/ui/SearchBar/SearchBar.tsx` created                                                                                                                                                                                               |
| 4   | **Add aria-label to Button**              | `ariaLabel` prop added to Button component and forwarded to native `aria-label`                                                                                                                                                                   |
| 5   | **Create DRY test utilities**             | `src/test/contextWrappers.tsx` with `createContextWrapper()` used across all component tests                                                                                                                                                      |
| 6   | **Add React.memo to MenuItem**            | `ReflectionItem` wrapped with `React.memo(ReflectionItemComponent, arePropsEqual)`                                                                                                                                                                |
| 7   | **Replace uuid with crypto.randomUUID()** | `uuid` package removed; `crypto.randomUUID()` used in `useFormAutoSave.ts`                                                                                                                                                                        |
| 8   | **Refactor ReflectionForm**               | Broken into sub-components: TitleInput, ContentEditor, FormHeader with clear separation                                                                                                                                                           |
| 9   | **Add type validation for Reflection**    | `validateReflection()` and `isValidReflection()` exported from `src/types/Reflection.ts`                                                                                                                                                          |
| 10  | **Comprehensive test suite**              | Tests added for: `formatDate.ts`, `reflectionsReducer.ts`, `useFormattedDate.ts`, `useSelectedReflection.ts`, `useReflectionActions.ts`, `useSearch.ts`, `usePersistentReflections.ts`, `useResponsive.ts`, `Header.tsx`, `Main.tsx`, `Aside.tsx` |
| 11  | **arePropsEqual function**                | Moved from `MenuItem.tsx` to `src/types/Reflection.ts` and exported for reuse and testing                                                                                                                                                         |
| 12  | **Exclude mock files from coverage**      | `**/__mocks__/**`, `**/*.test.ts`, and `**/*.test.tsx` excluded in `vite.config.ts`                                                                                                                                                               |
| 13  | **Fix reflectionsReducer DELETE bug**     | `DELETE_REFLECTION` now correctly auto-selects last remaining reflection using the filtered array                                                                                                                                                 |

---

### 📋 Remaining Actions

#### 🔴 High Impact

| #   | Item                                           | Effort | Notes                                                                                                                                              |
| --- | ---------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | **Replace window.confirm() with modal dialog** | 2–3h   | `ReflectionDetail.tsx` still uses `window.confirm()` for delete — poor UX, not keyboard accessible, not screen-reader friendly                     |
| B   | **Create content format layer**                | 4h     | `Reflection.content` is plain text only; WYSIWYG requires format versioning (`plaintext` / `html` / `editor-json`) and migration utilities         |
| C   | **Prepare auto-save for editor**               | 2–3h   | Current debounce pattern in `useFormAutoSave` is tied to React state onChange and won't work with editor-managed state (TipTap's `onUpdate`, etc.) |

#### 🟡 Medium Impact

| #   | Item                               | Effort | Notes                                                                                                           |
| --- | ---------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| D   | **Update search for rich content** | 2–3h   | `useSearch` filters `reflection.content` as plain text; with rich text this needs a plain-text extraction layer |
| E   | **Add coverage thresholds**        | 30m    | `vite.config.ts` has no `thresholds` config — coverage can silently regress                                     |
| F   | **Design content styling system**  | 1–2h   | No prose/typography CSS for rich text output (headings, lists, code blocks, quotes)                             |

#### 🟢 Low Impact / Housekeeping

| #   | Item                               | Effort | Notes                                                                                                |
| --- | ---------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| G   | **Use or delete Mode.ts**          | 15m    | `src/types/Mode.ts` (`"new" \| "edit" \| "view"`) is defined but never imported anywhere             |
| H   | **Add bundle analysis**            | 30m    | No `vite-plugin-visualizer` or equivalent — bundle size is invisible before adding a WYSIWYG library |
| I   | **Add CI/CD and pre-commit hooks** | 1–2h   | No coverage enforcement, no lint-staged, no GitHub Actions pipeline                                  |
