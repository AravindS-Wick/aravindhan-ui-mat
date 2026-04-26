import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /** Render as a block (pre + code). Defaults to inline. */
  block?: boolean;
  /** Programming language hint (adds data-lang). */
  lang?: string;
  /** Copy button for block variant. */
  copyable?: boolean;
}

export function Code({ block = false, lang, copyable = false, className = '', children, ...props }: CodeProps) {
  if (block) {
    return (
      <div className={cls('av-code-block', className)}>
        {lang && <span className="av-code-lang">{lang}</span>}
        {copyable && (
          <button
            type="button"
            className="av-code-copy"
            aria-label="Copy code"
            onClick={() => {
              const text = typeof children === 'string' ? children : '';
              navigator.clipboard?.writeText(text);
            }}
          >
            Copy
          </button>
        )}
        <pre data-lang={lang} {...props}>
          <code className="av-code">{children}</code>
        </pre>
      </div>
    );
  }

  return (
    <code className={cls('av-code', 'av-code-inline', className)} {...props}>
      {children}
    </code>
  );
}
