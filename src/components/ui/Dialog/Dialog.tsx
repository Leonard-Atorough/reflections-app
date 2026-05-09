import { useCallback, useEffect, useRef } from "react";
import styles from "./Dialog.module.css";
import { Button } from "../Button/Button";
import { TrashIcon } from "../icons/TrashIcon/TrashIcon";

export interface DialogProps {
  title: string;
  content: string;
  onAccept?: () => void;
  onCancel?: () => void;
  style?: React.CSSProperties;
}

export function Dialog(props: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        props.onCancel?.();
      }
    },
    [props],
  );

  const trapFocus = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = event.currentTarget;
    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0] as HTMLElement;
    const focusableContent = modal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement;

    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        props.onCancel?.();
      }
      trapFocus(event);
    },
    [trapFocus, props],
  );

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onClick={handleClickOutside}
      style={props.style}
      data-testid="dialog-wrapper"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-content"
      >
        <h1 id="dialog-title" className={styles.title}>
          {props.title}
        </h1>
        <p id="dialog-content" className={styles.content}>
          {props.content}
        </p>
        <div className={styles.actions}>
          {props.onAccept && (
            <Button ariaLabel="Accept" variant="danger" onClick={props.onAccept}>
              <TrashIcon />
            </Button>
          )}
          {props.onCancel && (
            <Button ariaLabel="Cancel" variant="secondary" onClick={props.onCancel}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="0" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="4" />
                <line x1="20" y1="0" x2="0" y2="20" stroke="currentColor" strokeWidth="4" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
