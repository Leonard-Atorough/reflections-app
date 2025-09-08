import { useState } from "react";
import type { Reflection } from "../../types/Reflection";

type props = {
  reflection: Reflection | null;
};

export function ReflectionForm({ reflection }: props) {
  const [title, setTitle] = useState<string>(reflection ? reflection.id : "");
  const [content, setContent] = useState<string>(
    reflection ? reflection.content : ""
  );

  return (
    <form>
      <div>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p> This will be a date</p>
      </div>
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
}
