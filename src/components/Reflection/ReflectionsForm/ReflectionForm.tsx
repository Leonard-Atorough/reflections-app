import { useContext, useState, useEffect, useRef } from "react";
import type { Reflection } from "@/types/Reflection";
import { useFormattedDate } from "@hooks/useFormattedDate";
import { useFormAutoSave } from "@hooks/useFormAutoSave";
import { EditingContext, ReflectionsContext, type ReflectionsContextType } from "@contexts";
import { MarkdownFormats } from "@/types/ContentFormat";
import { EditorToolbar } from "./EditorToolbar/EditorToolbar";
import styles from "./ReflectionForm.module.css";
import { useResponsive } from "@/hooks";

type props = {
  reflection: Reflection | null;
};

/**
 * Title input sub-component
 * Separated for clarity and future reusability
 */
function TitleInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      name="title"
      aria-label="Title"
      type="text"
      placeholder="Add a Title"
      value={value}
      className="title"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/**
 * Content editor sub-component
 * Easy to replace with WYSIWYG editor - just change this component
 */
function ContentEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string, format?: "markdown") => void;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const applyMarkdownFormat = (format: keyof typeof MarkdownFormats, args?: string) => {
    if (!textAreaRef.current) return;

    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || "sample text";

    let formatted: string;
    if (format === "link" && args) {
      formatted = MarkdownFormats.link(selectedText, args);
    } else {
      formatted = MarkdownFormats[format](selectedText);
    }

    const formattedContent = value.substring(0, start) + formatted + value.substring(end);
    onChange(formattedContent, "markdown");

    // Restore cursor position after formatting
    setTimeout(() => {
      textarea.selectionStart = start + formatted.length;
      textarea.selectionEnd = start + formatted.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className={styles.contentEditor}>
      <EditorToolbar onFormat={applyMarkdownFormat} />
      <textarea
        ref={textAreaRef}
        name="content"
        aria-label="Content"
        placeholder="Add some reflections..."
        value={value}
        className={`content ${styles.formContent}`}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/**
 * Form header with metadata display
 */
function FormHeader({
  title,
  onTitleChange,
  formattedDate,
}: {
  title: string;
  onTitleChange: (value: string) => void;
  formattedDate: string;
}) {
  const { isMobile } = useResponsive();
  return (
    <div className="header">
      <div className="titleWrapper">
        <TitleInput value={title} onChange={onTitleChange} />
      </div>
      {!isMobile && (
        <div className="metadata">
          <p className="date">{formattedDate}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Main ReflectionForm component
 * Orchestrates form state and auto-save logic
 */
export function ReflectionForm({ reflection }: props) {
  const { setIsEditing } = useContext(EditingContext);
  const { reflections } = useContext(ReflectionsContext) as ReflectionsContextType;

  const [title, setTitle] = useState<string>(reflection?.title || "");
  const [content, setContent] = useState<string>(reflection?.content || "");

  // Update state when reflection changes (switching between reflections)
  useEffect(() => {
    setTitle(reflection?.title || "");
    setContent(reflection?.content || "");
  }, [reflection]);

  const formattedUpdateDate = useFormattedDate(reflection?.dateUpdated ?? Date.now());

  // Use the auto-save hook
  useFormAutoSave({
    title,
    content,
    reflections,
    reflection,
  });

  return (
    <form
      className="body"
      onKeyDown={(e) => {
        if (e.key === "Escape") setIsEditing(false);
      }}
    >
      <FormHeader
        title={title}
        onTitleChange={setTitle}
        formattedDate={formattedUpdateDate as string}
      />
      <ContentEditor value={content} onChange={setContent} />
    </form>
  );
}
