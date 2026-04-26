import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type ThemeName = 'light' | 'dark' | 'forest' | 'ocean' | 'professional' | 'corporate';

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  toggleDark: () => {},
});

export interface ThemeProviderProps {
  /** Initial theme. Defaults to 'light'. Pass 'system' to follow OS preference. */
  defaultTheme?: ThemeName | 'system';
  /** Controlled theme value. */
  theme?: ThemeName;
  /** Called when theme changes. */
  onThemeChange?: (theme: ThemeName) => void;
  /** Target element for data-av-theme attribute. Defaults to document.documentElement. */
  target?: 'html' | 'body';
  /** Persist theme to localStorage under this key. Defaults to 'av-theme'. */
  storageKey?: string;
  children: ReactNode;
}

function resolveSystem(): ThemeName {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStorage(key: string): ThemeName | null {
  try {
    return (localStorage.getItem(key) as ThemeName) ?? null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: ThemeName) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function ThemeProvider({
  defaultTheme = 'light',
  theme: controlledTheme,
  onThemeChange,
  target = 'html',
  storageKey = 'av-theme',
  children,
}: ThemeProviderProps) {
  const isControlled = controlledTheme !== undefined;

  const [internalTheme, setInternalTheme] = useState<ThemeName>(() => {
    if (isControlled) return controlledTheme!;
    const stored = readStorage(storageKey);
    if (stored) return stored;
    return defaultTheme === 'system' ? resolveSystem() : defaultTheme;
  });

  const activeTheme = isControlled ? controlledTheme! : internalTheme;

  useEffect(() => {
    const el = target === 'body' ? document.body : document.documentElement;
    el.setAttribute('data-av-theme', activeTheme);
  }, [activeTheme, target]);

  // Follow system preference changes when defaultTheme='system' and uncontrolled
  useEffect(() => {
    if (isControlled || defaultTheme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const next = e.matches ? 'dark' : 'light' as ThemeName;
      setInternalTheme(next);
      writeStorage(storageKey, next);
      onThemeChange?.(next);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [isControlled, defaultTheme, storageKey, onThemeChange]);

  const setTheme = (next: ThemeName) => {
    if (!isControlled) {
      setInternalTheme(next);
      writeStorage(storageKey, next);
    }
    onThemeChange?.(next);
  };

  const toggleDark = () => {
    setTheme(activeTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, setTheme, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
