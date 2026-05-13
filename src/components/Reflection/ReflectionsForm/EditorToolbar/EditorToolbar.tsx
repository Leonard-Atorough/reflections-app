import { Button } from "@/components/ui";
import type { MarkdownFormats } from "@/types/ContentFormat";
import styles from "./EditorToolbar.module.css";

export interface EditorToolbarProps {
  onFormat: (format: keyof typeof MarkdownFormats, args?: string) => void;
}

export function EditorToolbar({ onFormat }: EditorToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.group}>
        <Button
          variant="outline"
          ariaLabel="Bold"
          size="small"
          onClick={() => onFormat("bold")}
          className={styles.editorButton}
        >
          B
        </Button>
        <Button
          variant="outline"
          ariaLabel="Italic"
          size="small"
          onClick={() => onFormat("italic")}
          className={styles.editorButton}
        >
          I
        </Button>
        <Button
          variant="outline"
          ariaLabel="Strikethrough"
          size="small"
          onClick={() => onFormat("strikethrough")}
          className={styles.editorButton}
        >
          S
        </Button>
        <Button
          variant="outline"
          ariaLabel="Underline"
          size="small"
          onClick={() => onFormat("underline")}
          className={styles.editorButton}
        >
          U
        </Button>
      </div>
      {<span className={styles.divider} />}
      <div className={styles.group}>
        <Button
          variant="outline"
          ariaLabel="Heading 1"
          size="small"
          onClick={() => onFormat("h1")}
          className={styles.editorButton}
        >
          H1
        </Button>
        <Button
          variant="outline"
          ariaLabel="Heading 2"
          size="small"
          onClick={() => onFormat("h2")}
          className={styles.editorButton}
        >
          H2
        </Button>
        <Button
          variant="outline"
          ariaLabel="Heading 3"
          size="small"
          onClick={() => onFormat("h3")}
          className={styles.editorButton}
        >
          H3
        </Button>
      </div>
      {<span className={styles.divider} />}
      <div className={styles.group}>
        <Button
          variant="outline"
          ariaLabel="Code block"
          size="small"
          onClick={() => onFormat("codeBlock")}
          className={styles.editorButton}
        >
          {"</>"}
        </Button>
        <Button
          variant="outline"
          ariaLabel="Inline code"
          size="small"
          onClick={() => onFormat("code")}
          className={styles.editorButton}
        >
          {"<>"}
        </Button>
      </div>
      {<span className={styles.divider} />}
      <div className={styles.group}>
        <Button
          variant="outline"
          ariaLabel="Quote"
          size="small"
          onClick={() => onFormat("quote")}
          className={styles.editorButton}
        >
          "
        </Button>
        <Button
          variant="outline"
          ariaLabel="Bullet List"
          size="small"
          onClick={() => onFormat("bulletList")}
          className={styles.editorButton}
        >
          •
        </Button>
        <Button
          variant="outline"
          ariaLabel="Numbered List"
          size="small"
          onClick={() => onFormat("numberedList")}
          className={styles.editorButton}
        >
          1.
        </Button>
        <Button
          variant="outline"
          ariaLabel="Link"
          size="small"
          onClick={() => onFormat("link")}
          className={styles.editorButton}
        >
          🔗
        </Button>
      </div>
    </div>
  );
}
