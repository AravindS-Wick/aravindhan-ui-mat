import { useRef, useState, type DragEvent, type InputHTMLAttributes } from 'react';
import { cls } from './types';

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Called when files are selected/dropped. */
  onChange?: (files: FileList) => void;
  /** Accepted MIME types or extensions. */
  accept?: string;
  /** Allow multiple files. */
  multiple?: boolean;
  /** Max file size in bytes. */
  maxSize?: number;
  /** Drag-and-drop zone label. */
  label?: string;
  /** Sub-label. */
  description?: string;
  /** Compact button-only mode. */
  buttonOnly?: boolean;
  /** Error message. */
  error?: string;
}

export function FileUpload({
  onChange,
  accept,
  multiple = false,
  maxSize,
  label = 'Drop files here or click to upload',
  description,
  buttonOnly = false,
  error,
  className = '',
  ...props
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    if (maxSize) {
      const oversized = Array.from(files).filter((f) => f.size > maxSize);
      if (oversized.length > 0) return;
    }
    onChange?.(files);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  if (buttonOnly) {
    return (
      <>
        <button type="button" className={cls('av-btn av-btn-outline', className)} onClick={() => inputRef.current?.click()}>
          Choose file{multiple ? 's' : ''}
        </button>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="av-sr-only" onChange={(e) => handleFiles(e.target.files)} {...props} />
        {error && <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>}
      </>
    );
  }

  return (
    <div
      className={cls('av-file-upload', dragging && 'av-file-upload-dragging', error && 'av-file-upload-error', className)}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label={label}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="av-sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        {...props}
      />
      <span className="av-file-upload-icon" aria-hidden="true">📁</span>
      <span className="av-file-upload-label">{label}</span>
      {description && <span className="av-file-upload-description">{description}</span>}
      {error && <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>}
    </div>
  );
}
