# Markdown Editor Implementation Guide

Simple toolbar-based markdown editor where users don't see markdown syntax. Toolbar buttons apply markdown formatting transparently.

## Overview

- Users edit content in a textarea with a toolbar above it
- Toolbar buttons insert markdown syntax around selected text
- Content is stored as markdown in the `content` field
- Markdown is rendered to HTML for display
- Existing plaintext reflections work as-is (auto-detected as format="plaintext")

## Component Examples

### Example 1: EditorToolbar Component

```typescript
export interface EditorToolbarProps {
  onFormat: (format: keyof typeof MarkdownFormats, args?: string) => void;
}

export function EditorToolbar({ onFormat }: EditorToolbarProps) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
      <ToolbarButton label="Bold" onClick={() => onFormat("bold")} />
      <ToolbarButton label="Italic" onClick={() => onFormat("italic")} />
      <ToolbarButton label="Code" onClick={() => onFormat("code")} />
      <ToolbarButton label="Quote" onClick={() => onFormat("quote")} />
      <ToolbarButton label="Heading 1" onClick={() => onFormat("h1")} />
      <ToolbarButton label="Bullet List" onClick={() => onFormat("bulletList")} />
      <ToolbarButton label="Numbered List" onClick={() => onFormat("numberedList")} />
      <ToolbarButton label="Link" onClick={() => onFormat("link")} />
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
```

### Example 2: Markdown Editor Component

```typescript
interface MarkdownEditorProps {
  content: string;
  onContentChange: (content: string, format: ContentFormat) => void;
}

export function MarkdownEditor({ content, onContentChange }: MarkdownEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const applyFormat = (format: keyof typeof MarkdownFormats, args?: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || "sample text";

    // Apply formatting
    let formatted: string;
    if (format === "link" && args) {
      formatted = MarkdownFormats.link(selectedText, args);
    } else {
      formatted = MarkdownFormats[format](selectedText);
    }

    // Replace selected text with formatted version
    const newContent =
      content.substring(0, start) + formatted + content.substring(end);

    onContentChange(newContent, "markdown");

    // Restore cursor position
    setTimeout(() => {
      textarea.selectionStart = start + formatted.length;
      textarea.selectionEnd = start + formatted.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div>
      <EditorToolbar onFormat={applyFormat} />
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value, "markdown")}
        placeholder="Type your thoughts here. Use toolbar buttons to add formatting..."
        style={{
          width: "100%",
          minHeight: "300px",
          padding: "12px",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      />
    </div>
  );
}
```

### Example 3: Preview Component

```typescript
interface MarkdownPreviewProps {
  content: string;
  format: ContentFormat;
}

export function MarkdownPreview({ content, format }: MarkdownPreviewProps) {
  if (format === "plaintext") {
    return <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>;
  }

  const html = renderMarkdown(content);

  return (
    <div
      style={{
        padding: "12px",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

### Example 4: Integrated Content Editor

```typescript
interface ContentEditorProps {
  reflection: {
    id: string;
    content: string;
    contentFormat: ContentFormat;
  };
  onSave: (content: string, format: ContentFormat) => void;
}

export function ContentEditor({ reflection, onSave }: ContentEditorProps) {
  const [content, setContent] = React.useState(reflection.content);
  const [showPreview, setShowPreview] = React.useState(false);

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Edit" : "Preview"}
        </button>
        <button onClick={() => onSave(content, reflection.contentFormat)} style={{ marginLeft: "8px" }}>
          Save
        </button>
      </div>

      {showPreview ? (
        <MarkdownPreview content={content} format={reflection.contentFormat} />
      ) : (
        <MarkdownEditor
          content={content}
          onContentChange={(newContent) => setContent(newContent)}
        />
      )}
    </div>
  );
}
```

## Integration Steps

### Step 1: ReflectionForm.tsx

Replace textarea with MarkdownEditor:

```typescript
// OLD:
<textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
/>

// NEW:
<MarkdownEditor
  content={content}
  onContentChange={(newContent, format) => {
    setContent(newContent);
    setContentFormat(format);
  }}
/>
```

### Step 2: ReflectionDetail Display

Use MarkdownPreview to render content:

```typescript
<MarkdownPreview
  content={reflection.content}
  format={reflection.contentFormat}
/>
```

## Data Structure

Reflections now include a `contentFormat` field:

```typescript
type Reflection = {
  id: string;
  title: string;
  dateCreated: number;
  dateUpdated: number;
  content: string;
  contentFormat: "plaintext" | "markdown"; // NEW FIELD
};
```

## Markdown Formats Available

The `MarkdownFormats` object provides functions for all supported formats:

- `bold(text)` - Wraps text in `**text**`
- `italic(text)` - Wraps text in `*text*`
- `code(text)` - Wraps text in `` `text` ``
- `codeBlock(text)` - Wraps text in triple backticks
- `h1(text)` - Prepends `# ` to text
- `h2(text)` - Prepends `## ` to text
- `h3(text)` - Prepends `### ` to text
- `quote(text)` - Prepends `> ` to each line
- `bulletList(text)` - Prepends `- ` to text
- `numberedList(text)` - Prepends `1. ` to text
- `link(text, url)` - Wraps as `[text](url)`
- `horizontalRule()` - Inserts `---`

## Key Features

1. **Transparent Markdown Storage**: Users don't see markdown syntax, but it's stored as markdown
2. **Backward Compatible**: Existing plaintext content auto-detected and works as-is
3. **No Migrations Needed**: Old reflections remain plaintext, new ones use markdown
4. **Both Formats Render**: Markdown can display plaintext, plaintext renders as-is
5. **Searchable**: Uses `extractPlainText()` to strip markdown for full-text search

## Implementation Checklist

- ✅ Reflection type has contentFormat field
- ✅ ContentFormat.ts has toolbar formatting functions
- ✅ EditorToolbar component (in MARKDOWN_EDITOR_GUIDE.ts)
- ✅ MarkdownEditor component (in MARKDOWN_EDITOR_GUIDE.ts)
- ✅ MarkdownPreview component (in MARKDOWN_EDITOR_GUIDE.ts)
- ✅ ContentEditor combined example (in MARKDOWN_EDITOR_GUIDE.ts)
- ⏳ Replace textarea in ReflectionForm with MarkdownEditor
- ⏳ Update ReflectionDetail preview to use MarkdownPreview
- ⏳ Update mock data to include contentFormat
- ⏳ Update usePersistedReflections to handle format field
