/**
 * Simplified Content Format System for Markdown Editor
 * Users edit via toolbar buttons → markdown stored transparently
 * Plaintext is markdown-compatible; no migrations needed
 */

export type ContentFormat = "plaintext" | "markdown";

/**
 * Extract searchable plain text from any format
 * Used for search functionality
 */
export function extractPlainText(content: string, format: ContentFormat): string {
  if (format === "plaintext") return content;

  // For markdown, strip the syntax but keep the content
  return content
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italic
    .replace(/`(.+?)`/g, "$1") // Remove inline code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links but keep text
    .replace(/^#+\s+/gm, "") // Remove headers
    .replace(/^[-*]\s+/gm, "") // Remove list markers
    .trim();
}

/**
 * Markdown formatting utilities for toolbar buttons
 */

export function toggleMarkdown(text: string, wrap: string): string {
  // If text is already wrapped, remove the wrapping
  const pattern = wrap.replace(/./g, (c) => (c === "*" ? "\\*" : c));
  const regex = new RegExp(`^${pattern}(.+)${pattern}$`);

  if (regex.test(text)) {
    return text.replace(regex, "$1");
  }

  // Otherwise, wrap it
  return `${wrap}${text}${wrap}`;
}

export function insertMarkdown(text: string, before: string, after?: string): string {
  return `${before}${text}${after || before}`;
}

export function surroundWithNewlines(text: string): string {
  return `\n${text}\n`;
}

/**
 * Markdown generators for toolbar buttons
 * Usage: Apply these to selected text in editor
 */
export const MarkdownFormats = {
  bold: (text: string) => toggleMarkdown(text, "**"),
  italic: (text: string) => toggleMarkdown(text, "*"),
  strikethrough: (text: string) => toggleMarkdown(text, "~~"),
  underline: (text: string) => toggleMarkdown(text, "__"),
  code: (text: string) => insertMarkdown(text, "`"),
  codeBlock: (text: string) => surroundWithNewlines(insertMarkdown(text, "```\n", "\n```")),
  h1: (text: string) => `# ${text}`,
  h2: (text: string) => `## ${text}`,
  h3: (text: string) => `### ${text}`,
  quote: (text: string) =>
    text
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n"),
  bulletList: (text: string) =>
    text
      .split("\n")
      .map((line) => `* ${line}`)
      .join("\n"),
  numberedList: (text: string) =>
    text
      .split("\n")
      .map((line, i) => `${i + 1}. ${line}`)
      .join("\n"),
  link: (text: string, url: string = "https://example.com") => `[${text}](${url})`,
  horizontalRule: () => "\n---\n",
} as const;

/**
 * Detect format from content heuristics
 * Plaintext has no markdown markers; markdown has them
 */
export function detectContentFormat(content: string): ContentFormat {
  if (!content) return "plaintext";

  // Check for markdown markers
  const hasMarkdown =
    /^#+\s|^\*\*|^\*|^`|^\[.*\]\(|^>|^[-*]\s|~~|^```/m.test(content) || // Start of line markers
    /\*\*.*\*\*|\*.*\*|`.*`|\[.*\]\(.*\)|~~.*~~/.test(content); // Inline markers

  return hasMarkdown ? "markdown" : "plaintext";
}

/**
 * Render markdown to HTML for display
 * Use a library like `marked` or `remark` for production
 */
export function renderMarkdown(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Inline code
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");

  // Code blocks
  html = html.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");

  // Lists
  html = html.replace(/^\* (.*)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  // Blockquotes
  html = html.replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>");

  // Line breaks
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;

  return html;
}
