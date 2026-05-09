import { useContext, useState, useEffect } from "react";
import type { Reflection } from "../../types/Reflection";

import { useFormattedDate } from "../../hooks/useFormattedDate";
import { useFormAutoSave } from "../../hooks/useFormAutoSave";
import { EditingContext, ReflectionsContext } from "@contexts";

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
function ContentEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      name="content"
      aria-label="Content"
      placeholder="Add some reflections..."
      value={value}
      className="content"
      onChange={(e) => onChange(e.target.value)}
    />
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
  return (
    <div className="header">
      <div className="titleWrapper">
        <TitleInput value={title} onChange={onTitleChange} />
      </div>
      <div className="metadata">
        <p className="date">{formattedDate}</p>
      </div>
    </div>
  );
}

/**
 * Main ReflectionForm component
 * Orchestrates form state and auto-save logic
 */
export function ReflectionForm({ reflection }: props) {
  const { setIsEditing } = useContext(EditingContext);
  const { reflections } = useContext(ReflectionsContext);

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
