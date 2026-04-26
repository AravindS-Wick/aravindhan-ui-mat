import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { cls } from './types';

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element. Defaults to `'div'`. */
  as?: ElementType;
  /** display shorthand. */
  display?: CSSProperties['display'];
  /** flexDirection shorthand. */
  direction?: CSSProperties['flexDirection'];
  /** alignItems shorthand. */
  align?: CSSProperties['alignItems'];
  /** justifyContent shorthand. */
  justify?: CSSProperties['justifyContent'];
  /** gap shorthand. */
  gap?: CSSProperties['gap'];
  /** padding shorthand. */
  p?: CSSProperties['padding'];
  /** paddingX shorthand. */
  px?: CSSProperties['padding'];
  /** paddingY shorthand. */
  py?: CSSProperties['padding'];
  /** margin shorthand. */
  m?: CSSProperties['margin'];
  /** width shorthand. */
  w?: CSSProperties['width'];
  /** height shorthand. */
  h?: CSSProperties['height'];
  /** overflow shorthand. */
  overflow?: CSSProperties['overflow'];
  /** position shorthand. */
  position?: CSSProperties['position'];
  /** borderRadius shorthand. */
  radius?: CSSProperties['borderRadius'];
  /** background shorthand. */
  bg?: CSSProperties['background'];
}

export function Box({
  as: Tag = 'div',
  display,
  direction,
  align,
  justify,
  gap,
  p,
  px,
  py,
  m,
  w,
  h,
  overflow,
  position,
  radius,
  bg,
  className = '',
  style,
  children,
  ...props
}: BoxProps) {
  const inlineStyle: CSSProperties = {
    ...(display ? { display } : {}),
    ...(direction ? { flexDirection: direction } : {}),
    ...(align ? { alignItems: align } : {}),
    ...(justify ? { justifyContent: justify } : {}),
    ...(gap ? { gap } : {}),
    ...(p ? { padding: p } : {}),
    ...(px ? { paddingLeft: px, paddingRight: px } : {}),
    ...(py ? { paddingTop: py, paddingBottom: py } : {}),
    ...(m ? { margin: m } : {}),
    ...(w ? { width: w } : {}),
    ...(h ? { height: h } : {}),
    ...(overflow ? { overflow } : {}),
    ...(position ? { position } : {}),
    ...(radius ? { borderRadius: radius } : {}),
    ...(bg ? { background: bg } : {}),
    ...style,
  };

  return (
    <Tag className={cls('av-box', className)} style={inlineStyle} {...props}>
      {children}
    </Tag>
  );
}
