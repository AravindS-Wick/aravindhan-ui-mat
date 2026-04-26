import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cls } from './types';

export interface TabItem {
  /** Unique identifier. */
  id: string;
  /** Tab label. */
  label: ReactNode;
  /** Tab panel content. */
  content: ReactNode;
  /** Disable this tab. */
  disabled?: boolean;
  /** Icon before label. */
  icon?: ReactNode;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** Tab definitions. */
  items: TabItem[];
  /** Initially active tab id. */
  defaultTab?: string;
  /** Controlled active tab. */
  activeTab?: string;
  /** Called on tab change. */
  onTabChange?: (id: string) => void;
  /** Visual style. */
  variant?: 'tabs' | 'pills' | 'underline';
  /** Tabs placement. */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Stretch tabs to fill container. */
  fill?: boolean;
  /** Justify tabs evenly. */
  justified?: boolean;
}

export function Tabs({
  items,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
  variant = 'tabs',
  placement = 'top',
  fill = false,
  justified = false,
  className = '',
  ...props
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultTab ?? items[0]?.id ?? '');

  const active = controlledTab ?? internalTab;

  function handleChange(id: string) {
    setInternalTab(id);
    onTabChange?.(id);
  }

  const navClass = cls(
    'av-tabs',
    `av-tabs-${variant}`,
    fill && 'av-tabs-fill',
    justified && 'av-tabs-justified',
    placement !== 'top' && `av-tabs-${placement}`,
    className,
  );

  return (
    <div
      className={cls('av-tabs-wrapper', `av-tabs-wrapper-${placement}`)}
      {...props}
    >
      <div role="tablist" className={navClass}>
        {items.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`av-tab-${tab.id}`}
            aria-controls={`av-tabpanel-${tab.id}`}
            aria-selected={active === tab.id}
            className={cls('av-tab', active === tab.id && 'av-tab-active', tab.disabled && 'av-tab-disabled')}
            disabled={tab.disabled}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => !tab.disabled && handleChange(tab.id)}
          >
            {tab.icon && <span className="av-tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="av-tab-panels">
        {items.map((tab) => (
          <div
            key={tab.id}
            id={`av-tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`av-tab-${tab.id}`}
            className={cls('av-tab-panel', active === tab.id && 'av-tab-panel-active')}
            hidden={active !== tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
