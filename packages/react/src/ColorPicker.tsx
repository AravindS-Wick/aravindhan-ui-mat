import { forwardRef, useState, useId, type InputHTMLAttributes } from 'react';
import { cls } from './types';

const DEFAULT_SWATCHES = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#ffffff', '#d1d5db', '#6b7280', '#111827',
];

export interface ColorPickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  /** Preset swatch colors. Pass empty array to hide swatches. */
  swatches?: string[];
  /** Show hex input alongside color picker. */
  showInput?: boolean;
  fullWidth?: boolean;
  /** Called with the hex color string whenever the value changes. */
  onColorChange?: (value: string) => void;
}

export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(function ColorPicker(
  {
    label,
    helperText,
    error,
    swatches = DEFAULT_SWATCHES,
    showInput = true,
    fullWidth = false,
    value,
    defaultValue = '#3b82f6',
    onColorChange,
    className = '',
    id,
    disabled,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [localColor, setLocalColor] = useState(String(defaultValue));
  const activeColor = value !== undefined ? String(value) : localColor;

  const handleChange = (color: string) => {
    if (value === undefined) setLocalColor(color);
    onColorChange?.(color);
  };

  return (
    <div className={cls('av-color-picker', fullWidth && 'av-color-picker-full', error && 'av-text-field-error', className)}>
      {label && (
        <label className="av-form-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="av-color-picker-row">
        <input
          ref={ref}
          id={inputId}
          type="color"
          className="av-color-picker-input"
          value={activeColor}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value)}
          {...props}
        />
        {showInput && (
          <input
            type="text"
            className={cls('av-input av-input-sm av-color-picker-hex', error && 'av-input-error')}
            value={activeColor}
            disabled={disabled}
            maxLength={7}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) handleChange(v);
            }}
            aria-label="Hex color value"
          />
        )}
      </div>
      {swatches.length > 0 && (
        <div className="av-color-picker-swatches">
          {swatches.map((color) => (
            <button
              key={color}
              type="button"
              className={cls('av-color-swatch', activeColor.toLowerCase() === color.toLowerCase() && 'av-color-swatch-active')}
              style={{ backgroundColor: color }}
              aria-label={color}
              disabled={disabled}
              onClick={() => handleChange(color)}
            />
          ))}
        </div>
      )}
      {error && <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>}
      {!error && helperText && <p className="av-form-helper">{helperText}</p>}
    </div>
  );
});
ColorPicker.displayName = 'ColorPicker';
