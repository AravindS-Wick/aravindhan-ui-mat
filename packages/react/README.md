# @aravi1008/ui-react

React 18 component library for [@aravi1008/ui](https://github.com/AravindS-Wick/aravindhan-ui) — 80+ production-ready components with TypeScript, `forwardRef`, `FormProvider` context, theme switching, and full accessibility.

## Install

```bash
npm install @aravi1008/ui-react @aravi1008/ui
```

## Quick start

```tsx
// 1. Import the CSS (once, at app root)
import '@aravi1008/ui/css';

// 2. Wrap your app with ThemeProvider
import { ThemeProvider } from '@aravi1008/ui-react';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}

// 3. Use components anywhere
import { Button, TextField, Modal, DataTable } from '@aravi1008/ui-react';

function MyForm() {
  return (
    <form>
      <TextField label="Email" type="email" fullWidth />
      <Button variant="primary" type="submit">Submit</Button>
    </form>
  );
}
```

## Features

- **80+ components** — inputs, overlays, navigation, data display, feedback, layout, typography
- **TypeScript first** — full types, `forwardRef` on all inputs for react-hook-form/Formik
- **FormProvider** — propagate `disabled`, `size`, `required` to all child fields
- **ThemeProvider** — 6 built-in themes (`light`, `dark`, `forest`, `ocean`, `professional`, `corporate`), localStorage persistence, OS preference detection
- **221 icons** — `<Icon name="star" />` from the built-in SVG sprite
- **Accessible** — ARIA attributes, focus traps in Modal/Drawer, keyboard navigation

## Component categories

| Category | Components |
|----------|------------|
| **Inputs** | Button, IconButton, ButtonGroup, ToggleButton, TextField, Textarea, NumberInput, PasswordInput, SearchInput, MaskedInput, Select, Combobox, Checkbox, Radio, Switch, Slider, Rating, OTPInput, FileUpload, ColorPicker, DatePicker, TimePicker, DateTimePicker, DateRangePicker |
| **Overlays** | Modal, Drawer, Popover, Tooltip, Toast |
| **Navigation** | Navbar, Sidenav, Tabs, Accordion, Dropdown, Menu, Breadcrumb, Pagination, Stepper |
| **Data Display** | DataTable, Table, List, Avatar, Badge, Chip, Tag, Stat, Timeline, TreeView |
| **Feedback** | Alert, Progress, Spinner, Skeleton, EmptyState |
| **Layout** | Box, Container, Grid, Stack, Divider, Section, AspectRatio, ScrollArea |
| **Typography** | Typography, Link, Kbd, Code |
| **Advanced** | Clock, Countdown, Icon, Image, CopyButton |
| **Hooks** | useDisclosure, useMediaQuery, useLocalStorage, useDebounce, useFocusTrap, useClickOutside |

## Theming

```tsx
// Switch themes programmatically
import { useTheme } from '@aravi1008/ui-react';

function ThemeToggle() {
  const { theme, setTheme, toggleDark } = useTheme();
  return <button onClick={toggleDark}>{theme === 'dark' ? '☀️' : '🌙'}</button>;
}
```

## Form integration (react-hook-form)

```tsx
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@aravi1008/ui-react';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <TextField
        label="Email"
        {...register('email', { required: 'Email is required' })}
        error={errors.email?.message}
        fullWidth
      />
      <Button type="submit" variant="primary">Login</Button>
    </form>
  );
}
```

## License

MIT © Aravindhan Sivaraman
