# @aravi1008/ui-mat — Framework Wrappers

Monorepo of framework-specific component packages for [`@aravi1008/ui`](https://www.npmjs.com/package/@aravi1008/ui).

Each package maps props to the `av-` CSS class system — so the core CSS package does all the heavy lifting and these wrappers stay thin.

---

## Packages

| Package | Status | Description |
|---------|--------|-------------|
| [`@aravi1008/ui-react`](./packages/react) | ✅ Ready | React 18+ components |
| [`@aravi1008/ui-vue`](./packages/vue) | ✅ Ready | Vue 3 (Composition API) components |

---

## Component Coverage (~60+ components)

### Core UI
Accordion, Alert, Avatar, AvatarGroup, Badge, Breadcrumb, Button, Card, Chip, Drawer, Dropdown, Modal, Navbar, Pagination, Progress, Skeleton, Spinner, Stat, Stepper, Switch, Table, Tabs, Timeline, Toast, Tooltip

### Layout
Box, Container, Grid, GridItem, Stack, Divider, Section, AspectRatio, ScrollArea, Paper

### Typography
Typography, Link, Kbd, Code

### Inputs
TextField, IconButton, ButtonGroup, ToggleButton, ToggleButtonGroup, Checkbox, Radio, RadioGroup, Slider, Rating, FileUpload, Combobox, FormField, FormLabel, FormInput, FormSelect, FormTextarea, FormCheck, FormHelperText, InputGroup

### Data Display
DataTable, Image, Tag, TagGroup, ChipGroup, List, ListItem, EmptyState

### Navigation
Menu, MenuItem, Sidenav, SidenavItem, SidenavGroup

### Utility
Portal, VisuallyHidden, ThemeToggle

---

## Installation

```bash
# React
npm install @aravi1008/ui @aravi1008/ui-react

# Vue
npm install @aravi1008/ui @aravi1008/ui-vue
```

## Usage

### React

```tsx
import '@aravi1008/ui/css';
import { Button, TextField, DataTable, ThemeToggle } from '@aravi1008/ui-react';

function App() {
  return (
    <>
      <ThemeToggle themes={['light', 'dark']} />
      <TextField label="Name" placeholder="Enter name" />
      <Button variant="primary" size="lg">Submit</Button>
    </>
  );
}
```

### Vue

```vue
<script setup>
import '@aravi1008/ui/css';
import { Button, TextField, ThemeToggle } from '@aravi1008/ui-vue';
</script>

<template>
  <ThemeToggle :themes="['light', 'dark']" />
  <TextField label="Name" placeholder="Enter name" v-model="name" />
  <Button variant="primary" size="lg">Submit</Button>
</template>
```

---

## Development

```bash
pnpm install
pnpm build          # build all packages
pnpm typecheck      # type-check all packages
pnpm dev            # watch mode
```

All components are thin wrappers — they map typed props to `av-` CSS classes.
The core [`@aravi1008/ui`](https://github.com/AravindS-Wick/aravindhan-ui) package provides all styles.
