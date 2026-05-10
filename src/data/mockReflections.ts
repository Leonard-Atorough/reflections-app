import type { Reflection } from "../types/Reflection";

export const defaultReflections: Reflection[] = [
  {
    id: crypto.randomUUID(),
    title: "📝 Getting Started with Reflections",
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    content: `# Welcome to Reflections

This is your personal reflection app. Here's how to get started:

## Basic Navigation

- **View a reflection**: Click on any reflection in the sidebar to open it
- **Edit**: Click on the title or content area to start editing
- **Save**: Your changes are automatically saved when you click away or switch reflections
- **Delete**: Select a reflection and click the delete button to remove it

## Creating Reflections

1. Click the **Add Reflection** button (+ icon) at the top
2. Or click in an empty area when no reflections exist
3. A new reflection appears with today's date

## Using the Toolbar

When editing, use the toolbar buttons to format your text:

- **Bold**: Makes text **bold**
- **Italic**: Makes text *italic*
- **Code**: For \`inline code\`
- **Quote**: For quoted text
- **Heading**: Creates section headers
- **Lists**: Add bulleted or numbered lists
- **Link**: Insert links to URLs

No need to remember markdown syntax—the toolbar handles it!

## Tips & Tricks

- Your reflections are saved locally in your browser
- Search works across all your reflections
- Use headings to organize longer reflections
- Try different formatting to see what works best for you

Happy reflecting!`.trim(),
    contentFormat: "markdown",
  },
];
