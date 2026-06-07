import React from 'react';
import { cls } from './types';

export const BentoGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cls("av-bento-grid", className)} {...props}>
        {children}
      </div>
    );
  }
);
BentoGrid.displayName = 'BentoGrid';

export interface BentoGridItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  header?: React.ReactNode;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const BentoGridItem = React.forwardRef<HTMLDivElement, BentoGridItemProps>(
  ({ className, title, description, header, icon, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cls("av-bento-grid-item", className)} {...props}>
        {header}
        <div className="av-bento-grid-item__content">
          {icon}
          <div className="av-bento-grid-item__title">{title}</div>
          <div className="av-bento-grid-item__description">{description}</div>
        </div>
        {children}
      </div>
    );
  }
);
BentoGridItem.displayName = 'BentoGridItem';
