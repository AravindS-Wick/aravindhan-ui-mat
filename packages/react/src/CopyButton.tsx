import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cls, type Variant, type Size } from './types';

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onCopy' | 'onError'> {
  /** Text to copy. */
  value: string;
  /** Label before copying. Defaults to `'Copy'`. */
  label?: ReactNode;
  /** Label after copying. Defaults to `'Copied!'`. */
  copiedLabel?: ReactNode;
  /** Reset delay in ms. Defaults to 2000. */
  timeout?: number;
  /** Called after successful copy. */
  onCopy?: (value: string) => void;
  /** Called on copy failure. */
  onError?: (error: Error) => void;
  variant?: Variant;
  size?: Size;
}

export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied!',
  timeout = 2000,
  onCopy,
  onError,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.(value);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Copy failed'));
    }
  }

  return (
    <button
      type="button"
      className={cls(
        'av-copy-btn',
        `av-btn av-btn-${variant}`,
        size !== 'md' && `av-btn-${size}`,
        copied && 'av-copy-btn-copied',
        className,
      )}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      aria-live="polite"
      onClick={handleCopy}
      {...props}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
