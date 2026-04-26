import { useState, type ImgHTMLAttributes, type ReactNode } from 'react';
import { cls } from './types';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'circle';
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  position?: string;
  ratio?: string;
  lazy?: boolean;
  /** Fallback URL string or ReactNode to render when the image fails to load. */
  fallback?: string | ReactNode;
  caption?: string;
  fluid?: boolean;
}

export function Image({
  radius,
  fit = 'cover',
  position,
  ratio,
  lazy = false,
  fallback,
  caption,
  fluid = false,
  className = '',
  style,
  onError,
  alt = '',
  ...props
}: ImageProps) {
  const [errored, setErrored] = useState(false);

  const radiusClass = radius ? `av-rounded-${radius}` : undefined;
  const fitClass = fit !== 'cover' ? `av-object-${fit}` : undefined;

  if (errored && fallback !== undefined && typeof fallback !== 'string') {
    const fallbackEl = (
      <div
        className={cls('av-img-fallback', fluid && 'av-img-fluid', radiusClass, className)}
        style={style}
        role="img"
        aria-label={alt}
      >
        {fallback}
      </div>
    );
    if (ratio || caption) {
      return (
        <figure className="av-img-figure" style={ratio ? { aspectRatio: ratio } : undefined}>
          {fallbackEl}
          {caption && <figcaption className="av-img-caption">{caption}</figcaption>}
        </figure>
      );
    }
    return fallbackEl;
  }

  const img = (
    <img
      className={cls('av-img', fluid && 'av-img-fluid', radiusClass, fitClass, className)}
      style={{ ...(position ? { objectPosition: position } : {}), ...style }}
      loading={lazy ? 'lazy' : undefined}
      alt={alt}
      onError={(e) => {
        if (fallback && !errored) {
          setErrored(true);
          if (typeof fallback === 'string') {
            (e.target as HTMLImageElement).src = fallback;
          }
        }
        onError?.(e);
      }}
      {...props}
    />
  );

  if (ratio || caption) {
    return (
      <figure className="av-img-figure" style={ratio ? { aspectRatio: ratio } : undefined}>
        {img}
        {caption && <figcaption className="av-img-caption">{caption}</figcaption>}
      </figure>
    );
  }

  return img;
}
