'use client';

import { forwardRef } from 'react';

/**
 * Reusable Heading component with unified underline and highlight styling.
 * Automatically aligns with light/dark theme and user's theme accent colors.
 */
const Heading = forwardRef(function Heading(
  {
    as: Tag = 'h2',
    align = 'left', // 'left' | 'center' | 'right'
    accent,
    accentColor,
    underline = false,
    className = '',
    children,
    style = {},
    ...props
  },
  ref
) {
  const effectiveAccent = accentColor || accent;
  const alignClass =
    align === 'center'
      ? underline
        ? 'heading-highlight-center'
        : 'text-center'
      : underline
      ? 'heading-highlight'
      : 'text-left';

  const customStyle = effectiveAccent
    ? { ...style, '--heading-accent': effectiveAccent }
    : style;

  return (
    <Tag
      ref={ref}
      style={customStyle}
      className={[alignClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
});

export default Heading;
