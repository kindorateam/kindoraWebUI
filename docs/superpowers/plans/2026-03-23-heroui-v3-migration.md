# HeroUI v2 → v3 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Kindora web app from HeroUI v2 to HeroUI v3 stable, adopting compound component patterns, removing Framer Motion, and updating all styling tokens.

**Architecture:** Full migration approach — update all component code in a feature branch, swap dependencies, then verify. Components are migrated by domain (shared first, then features) to catch shared component issues early. Each task produces a working commit.

**Tech Stack:** React 19, HeroUI v3 (`@heroui/react` latest, `@heroui/styles`), Tailwind CSS 4, TypeScript 5

---

## V2 → V3 Component API Quick Reference

This reference captures the key API changes needed throughout the migration. Subagents should consult this before modifying any component.

### Import Changes
- All components: `import { X } from "@heroui/react"` (same package name, new version)
- Toast: `import { Toast, toast } from "@heroui/react"` (replaces `addToast`)
- Types: `import type { Selection } from "@heroui/react"` (still available)

### Compound Component Patterns

**Card:** `CardBody` → `Card.Content`, `CardHeader` → `Card.Header`, `CardFooter` → `Card.Footer`
```tsx
// v2
<Card><CardHeader>Title</CardHeader><CardBody>Content</CardBody><CardFooter>Footer</CardFooter></Card>
// v3
<Card><Card.Header><Card.Title>Title</Card.Title></Card.Header><Card.Content>Content</Card.Content><Card.Footer>Footer</Card.Footer></Card>
```

**Modal:** `ModalContent` → `Modal.Backdrop > Modal.Container > Modal.Dialog`, `ModalHeader` → `Modal.Header`, `ModalBody` → `Modal.Body`, `ModalFooter` → `Modal.Footer`

**IMPORTANT:** For controlled modals, `isOpen`/`onOpenChange` go on `Modal.Backdrop`, NOT on `Modal`. When using controlled state, there is no wrapping `<Modal>` element.
```tsx
// v2
<Modal isOpen={isOpen} onOpenChange={onOpenChange}><ModalContent>{(onClose) => (<><ModalHeader>Title</ModalHeader><ModalBody>Body</ModalBody><ModalFooter><Button onPress={onClose}>Close</Button></ModalFooter></>)}</ModalContent></Modal>
// v3 (controlled — most common in this codebase)
<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}><Modal.Container><Modal.Dialog><Modal.CloseTrigger /><Modal.Header><Modal.Heading>Title</Modal.Heading></Modal.Header><Modal.Body>Body</Modal.Body><Modal.Footer><Button slot="close">Close</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop>
// v3 (uncontrolled — trigger-based)
<Modal><Button>Open Modal</Button><Modal.Backdrop><Modal.Container><Modal.Dialog>...</Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
```

**Table:** `TableHeader` → `Table.Header`, `TableBody` → `Table.Body`, `TableColumn` → `Table.Column`, `TableRow` → `Table.Row`, `TableCell` → `Table.Cell`. Wrap in `Table.ScrollContainer > Table.Content`.
```tsx
// v2
<Table><TableHeader><TableColumn>Name</TableColumn></TableHeader><TableBody>{items.map(item => <TableRow key={item.id}><TableCell>{item.name}</TableCell></TableRow>)}</TableBody></Table>
// v3
<Table><Table.ScrollContainer><Table.Content aria-label="..."><Table.Header><Table.Column>Name</Table.Column></Table.Header><Table.Body>{items.map(item => <Table.Row key={item.id}><Table.Cell>{item.name}</Table.Cell></Table.Row>)}</Table.Body></Table.Content></Table.ScrollContainer></Table>
```

**Dropdown:** `DropdownTrigger` → `Dropdown.Trigger` (or direct child Button), `DropdownMenu` → `Dropdown.Popover > Dropdown.Menu`, `DropdownItem` → `Dropdown.Item` with `<Label>` children, `DropdownSection` → `Dropdown.Section`
```tsx
// v2
<Dropdown><DropdownTrigger><Button>Menu</Button></DropdownTrigger><DropdownMenu><DropdownItem key="edit">Edit</DropdownItem></DropdownMenu></Dropdown>
// v3
<Dropdown><Button>Menu</Button><Dropdown.Popover><Dropdown.Menu><Dropdown.Item id="edit" textValue="Edit"><Label>Edit</Label></Dropdown.Item></Dropdown.Menu></Dropdown.Popover></Dropdown>
```

**Tabs:** `Tab` → `Tabs.Tab` with `Tabs.Indicator`, wrapped in `Tabs.ListContainer > Tabs.List`. `selectedKey` → `selectedKey`, `onSelectionChange` → `onSelectionChange`.
```tsx
// v2
<Tabs selectedKey={tab} onSelectionChange={setTab}><Tab key="a" title="Tab A">Content A</Tab></Tabs>
// v3
<Tabs selectedKey={tab} onSelectionChange={setTab}><Tabs.ListContainer><Tabs.List aria-label="..."><Tabs.Tab id="a">Tab A<Tabs.Indicator /></Tabs.Tab></Tabs.List></Tabs.ListContainer><Tabs.Panel id="a">Content A</Tabs.Panel></Tabs>
```

**Select:** `SelectItem` → `ListBox.Item` inside `Select.Popover > ListBox`. Needs `Select.Trigger`, `Select.Value`, `Select.Indicator`.
```tsx
// v2
<Select label="Role" selectedKeys={keys} onSelectionChange={setKeys}><SelectItem key="admin">Admin</SelectItem></Select>
// v3
<Select selectedKey={key} onSelectionChange={setKey}><Label>Role</Label><Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger><Select.Popover><ListBox><ListBox.Item id="admin" textValue="Admin">Admin<ListBox.ItemIndicator /></ListBox.Item></ListBox></Select.Popover></Select>
```

**Avatar:** Now compound with `Avatar.Image` and `Avatar.Fallback`. No more `src`/`name` props on root.
```tsx
// v2
<Avatar src={url} name="John" />
// v3
<Avatar><Avatar.Image src={url} alt="John" /><Avatar.Fallback>JD</Avatar.Fallback></Avatar>
```

**AvatarGroup:** Removed. Use `<div className="flex -space-x-2">` with counter Avatar.

**Badge:** Now uses `Badge.Anchor` wrapper pattern.
```tsx
// v2
<Badge content="5"><Avatar /></Badge>
// v3
<Badge.Anchor><Avatar /><Badge color="danger">5</Badge></Badge.Anchor>
```

**Tooltip:** Now compound with `Tooltip.Content`. Content prop removed.
```tsx
// v2
<Tooltip content="Help text"><Button>Hover</Button></Tooltip>
// v3
<Tooltip><Button>Hover</Button><Tooltip.Content>Help text</Tooltip.Content></Tooltip>
```

**Popover:** Now compound with `Popover.Content > Popover.Dialog`.
```tsx
// v2
<Popover><PopoverTrigger><Button>Click</Button></PopoverTrigger><PopoverContent>Content</PopoverContent></Popover>
// v3
<Popover><Button>Click</Button><Popover.Content><Popover.Dialog>Content</Popover.Dialog></Popover.Content></Popover>
```

**Checkbox:** Now compound with `Checkbox.Control > Checkbox.Indicator` and `Checkbox.Content > Label`.
```tsx
// v2
<Checkbox>Remember me</Checkbox>
// v3
<Checkbox><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control><Checkbox.Content><Label>Remember me</Label></Checkbox.Content></Checkbox>
```

**Switch:** Now compound with `Switch.Control > Switch.Thumb` and `Switch.Content > Label`.
```tsx
// v2
<Switch>Enable</Switch>
// v3
<Switch><Switch.Control><Switch.Thumb /></Switch.Control><Switch.Content><Label>Enable</Label></Switch.Content></Switch>
```

**InputOtp:** Now `InputOTP` with `InputOTP.Group > InputOTP.Slot` and `InputOTP.Separator`.

**Breadcrumbs:** `BreadcrumbItem` → `Breadcrumbs.Item`.

**ProgressBar:** (was `Progress`) Now compound with `ProgressBar.Track > ProgressBar.Fill`.

**DateInput:** → `DateField` with `DateField.Group > DateField.Input > DateField.Segment`.

**NumberInput:** → `NumberField` with `NumberField.Group`, `NumberField.Input`, increment/decrement buttons.

**Spinner:** Same import, check prop compatibility.

**Skeleton:** Same API, just `<Skeleton className="..." />`.

**ScrollShadow:** Same API.

**Link:** Check for `Link.Icon` sub-component.

**Image:** Removed in v3. Replace with `<img>` tag.

### Renamed Components
- `Divider` → `Separator`
- `Progress` → `ProgressBar`
- `CircularProgress` → `ProgressCircle`

### Removed APIs
- `extendVariants` — removed, use CSS `@layer components` overrides instead
- `HeroUIProvider` — removed, no provider needed
- `ToastProvider` / `addToast` — replaced with `Toast.Provider` / `toast()`
- `useDisclosure` — replaced with `useOverlayState` (or just use controlled state)
- `disableRipple` prop — Ripple removed entirely
- `maxListboxHeight` prop on Select — check v3 equivalent (CSS override)
- `heroui()` Tailwind plugin — removed, use `@import "@heroui/styles"` instead
- `classNames` prop on components — use compound sub-component `className` instead
- `AvatarGroup` — removed, use flex + negative spacing

### Styling Token Changes
- `text-tiny` → `text-xs`
- `text-small` → `text-sm`
- `text-medium` → `text-base`
- `text-large` → `text-lg`
- `rounded-small` → `rounded-sm`
- `rounded-medium` → `rounded-md`
- `rounded-large` → `rounded-lg`
- `primary` (color) → `accent`
- `secondary` (color) → removed
- `content1-4` → `surface` / `overlay`

### Toast API Change
```tsx
// v2
import { addToast } from "@heroui/react"
addToast({ title: "Success", description: "Done", color: "success" })
// v3
import { toast } from "@heroui/react"
toast("Success", { description: "Done", variant: "success" })
// v3 convenience methods (preferred)
toast.success("Done")
toast.info("Info message")
toast.warning("Warning")
toast.danger("Error occurred")
```

---

## Task 1: Update Dependencies & Configuration

**Files:**
- Modify: `package.json`
- Modify: `src/index.css`
- Delete: `src/hero.ts`

- [ ] **Step 1: Update package.json dependencies**

Replace HeroUI v2 packages with v3, remove framer-motion:

```bash
bun remove @heroui/react @heroui/use-infinite-scroll framer-motion
bun add @heroui/react@latest @heroui/styles@latest
```

- [ ] **Step 2: Update CSS imports**

In `src/index.css`, replace:
```css
@import "tailwindcss";
@plugin './hero.ts';
@source '../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}';
```
With:
```css
@import "tailwindcss";
@import "@heroui/styles";
```
Keep the rest of the file (font import, custom-variant, iconify plugin, body styles, scroll classes).

- [ ] **Step 3: Delete hero.ts**

```bash
rm src/hero.ts
```

- [ ] **Step 4: Run typecheck to confirm dependency changes are picked up**

```bash
bun run typecheck
```
Expected: Many type errors from component API changes (this is expected — we'll fix them in subsequent tasks).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: update HeroUI v2→v3 deps, CSS imports, remove hero.ts"
```

---

## Task 2: Update App Root (Provider & Toast)

**Files:**
- Modify: `src/main.tsx`

- [ ] **Step 1: Remove HeroUIProvider, update ToastProvider**

Replace `HeroUIProvider` and `ToastProvider` imports with `Toast`:

```tsx
import { Toast } from "@heroui/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Provider as JotaiProvider } from "jotai"
import { createRoot } from "react-dom/client"
import "jotai-devtools/styles.css"

import "./index.css"

import { queryClient } from "@/services/queryClient"
import { appStore } from "@/stores/jotaiStore"

import App from "./App"
import { ErrorBoundary } from "./components/error"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Root element not found")

createRoot(rootElement).render(
	<ErrorBoundary
		level="root"
		onError={(error, errorInfo) => {
			console.error("Root Application Error:", error, errorInfo)
		}}
	>
		<JotaiProvider store={appStore}>
			<QueryClientProvider client={queryClient}>
				<Toast.Provider />
				<App />
			</QueryClientProvider>
		</JotaiProvider>
	</ErrorBoundary>,
)
```

- [ ] **Step 2: Commit**

```bash
git add src/main.tsx && git commit -m "refactor: remove HeroUIProvider, update Toast.Provider for v3"
```

---

## Task 3: Migrate Shared Components — Button

**Files:**
- Modify: `src/components/Button.tsx`

- [ ] **Step 1: Replace extendVariants with CSS-based custom Button**

`extendVariants` is removed in v3. Replace with a wrapper that applies Tailwind classes via `className`:

```tsx
import { Button as HeroButton } from "@heroui/react"
import clsx from "clsx"

import type React from "react"

type ButtonProps = React.ComponentProps<typeof HeroButton> & {
	color?: "primary" | "secondary" | "text"
}

const Button = ({ color = "primary", className, ...props }: ButtonProps) => {
	const colorStyles = {
		primary: "bg-brand text-white hover:bg-brand-hover active:bg-brand-active",
		secondary:
			"border border-black/10 bg-transparent text-neutral-800 hover:bg-black/5 active:bg-black/10",
		text: "min-w-auto h-auto border-none p-0 bg-transparent text-brand text-xs font-semibold",
	}

	const baseStyles =
		color === "primary" || color === "secondary"
			? "font-medium rounded-[14px] py-2.5 px-5 hover:opacity-100!"
			: ""

	return <HeroButton className={clsx(colorStyles[color], baseStyles, className)} {...props} />
}

export default Button
```

Note: Check if v3 Button still supports `variant` prop for its own variants. If `color` conflicts with v3's built-in `color` prop, rename the custom prop or use `variant` mapping. The v3 Button has variants: `primary`, `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`. Consider mapping our custom `primary` to pass as className overrides only.

- [ ] **Step 2: Commit**

```bash
git add src/components/Button.tsx && git commit -m "refactor: migrate Button from extendVariants to className wrapper for v3"
```

---

## Task 4: Migrate Shared Components — Chip

**Files:**
- Modify: `src/components/Chip.tsx`

- [ ] **Step 1: Update Chip wrapper for v3 compound API**

```tsx
import { Chip as HeroUIChip } from "@heroui/react"
import clsx from "clsx"

import type React from "react"

const Chip = ({ className, children, ...props }: React.ComponentProps<typeof HeroUIChip>) => {
	return (
		<HeroUIChip
			{...props}
			className={clsx(className, "bg-black/5 px-2 py-1 hover:bg-brand/5 hover:text-brand rounded-sm")}
		>
			{children}
		</HeroUIChip>
	)
}

export default Chip
```

Note: v3 Chip no longer has `classNames={{ content: "p-0" }}` prop. The `radius="sm"` prop is also removed — use `rounded-sm` in className. Check if the styling still works and adjust as needed.

- [ ] **Step 2: Commit**

```bash
git add src/components/Chip.tsx && git commit -m "refactor: migrate Chip wrapper to v3 API"
```

---

## Task 5: Migrate Shared Components — DataTable

**Files:**
- Modify: `src/components/DataTable/index.tsx`

- [ ] **Step 1: Read the current DataTable implementation**

Read the full file to understand the current v2 Table usage pattern.

- [ ] **Step 2: Update to v3 compound Table pattern**

Replace flat imports (`Table, TableBody, TableCell, TableColumn, TableHeader, TableRow`) with compound pattern:
- Wrap table content in `<Table.ScrollContainer><Table.Content aria-label="...">`
- `TableHeader` → `Table.Header`
- `TableColumn` → `Table.Column`
- `TableBody` → `Table.Body`
- `TableRow` → `Table.Row`
- `TableCell` → `Table.Cell`

The import changes from:
```tsx
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
```
To:
```tsx
import { Table } from "@heroui/react"
```
Then use `Table.Header`, `Table.Body`, etc.

- [ ] **Step 3: Commit**

```bash
git add src/components/DataTable/ && git commit -m "refactor: migrate DataTable to v3 compound Table API"
```

---

## Task 6: Migrate Shared Components — Breadcrumbs, Stepper, StaffCard, IdentityChip, StaffProfileTab, TableError, Header

**Files:**
- Modify: `src/components/Breadcrumbs.tsx` — `BreadcrumbItem` → `Breadcrumbs.Item`
- Modify: `src/components/Stepper/index.tsx` — `Progress` → `ProgressBar` with compound pattern
- Modify: `src/components/StaffCard.tsx` — `Card/CardBody/CardHeader/CardFooter` → compound
- Modify: `src/components/IdentityChip/index.tsx` — Avatar + Chip to v3 compound
- Modify: `src/components/StaffProfileTab.tsx` — Link to v3
- Modify: `src/components/TableError.tsx` — Card/CardBody + Button to v3
- Modify: `src/components/Header.tsx` — Dropdown compound + Avatar compound

- [ ] **Step 1: Read all files listed above**

- [ ] **Step 2: Migrate each file**

For each file apply the compound component patterns from the quick reference above. Key changes:
- `BreadcrumbItem` → `Breadcrumbs.Item`
- `Progress` → `ProgressBar` with `ProgressBar.Track > ProgressBar.Fill`
- `CardBody` → `Card.Content`, `CardHeader` → `Card.Header`, `CardFooter` → `Card.Footer`
- `Avatar src={x} name={y}` → `<Avatar><Avatar.Image src={x} alt={y} /><Avatar.Fallback>initials</Avatar.Fallback></Avatar>`
- `DropdownTrigger/DropdownMenu/DropdownItem/DropdownSection` → `Dropdown.Popover/Dropdown.Menu/Dropdown.Item/Dropdown.Section`
- `dividerProps` on DropdownSection → use `<Separator />` between sections

- [ ] **Step 3: Commit**

```bash
git add src/components/ && git commit -m "refactor: migrate shared components (Breadcrumbs, Stepper, StaffCard, Header, etc.) to v3"
```

---

## Task 7: Migrate Shared Components — Chat, Error Fallbacks

**Files:**
- Modify: `src/components/Chat/ChatMessage.tsx` — Avatar compound, remove `disableRipple`
- Modify: `src/components/Chat/Chat.tsx` — Avatar + Image + Input to v3
- Modify: `src/components/error/CompactErrorFallback.tsx` — Button to v3
- Modify: `src/components/error/ErrorFallback.tsx` — Button to v3

- [ ] **Step 1: Read and migrate each file**

Key changes:
- Remove `disableRipple` prop (Ripple doesn't exist in v3)
- `Image` component removed in v3 → replace with `<img>` tag
- Avatar to compound pattern
- Input remains largely the same in v3 (primitive component)

- [ ] **Step 2: Commit**

```bash
git add src/components/Chat/ src/components/error/ && git commit -m "refactor: migrate Chat and error components to v3"
```

---

## Task 8: Migrate Auth Feature

**Files:**
- Modify: `src/features/auth/components/SignInCard.tsx` — Card to v3
- Modify: `src/features/auth/components/SignInForm.tsx` — Card parts, Checkbox, Divider→Separator, Input, Button, Link
- Modify: `src/features/auth/components/OTPVerificationForm.tsx` — Card parts, InputOtp→InputOTP compound, Button, Link, Tooltip
- Modify: `src/features/auth/components/ForgotPasswordForm.tsx` — Card parts, Input, Button
- Modify: `src/features/auth/components/ForgotPasswordConfirmation.tsx` — Card parts, Button
- Modify: `src/features/auth/components/ResetPasswordForm.tsx` — Card parts, Input, Button
- Modify: `src/features/auth/components/ResetPasswordConfirmation.tsx` — Card parts, Button

- [ ] **Step 1: Read all auth component files**

- [ ] **Step 2: Migrate each file**

Key changes:
- `CardBody/CardHeader/CardFooter` → `Card.Content/Card.Header/Card.Footer`
- `Divider` → `Separator`
- `Checkbox` → compound: `Checkbox.Control > Checkbox.Indicator` + `Checkbox.Content > Label`
- `InputOtp` → `InputOTP` with `InputOTP.Group > InputOTP.Slot` + `InputOTP.Separator`
- `Tooltip content="..."` → `<Tooltip><TriggerElement /><Tooltip.Content>...</Tooltip.Content></Tooltip>`

- [ ] **Step 3: Commit**

```bash
git add src/features/auth/ && git commit -m "refactor: migrate auth feature components to v3"
```

---

## Task 9: Migrate Staff Feature — Tables & Detail Headers

**Files:**
- Modify: `src/features/staff/components/StaffTable/index.tsx` — Table compound
- Modify: `src/features/staff/components/StaffTable/renderCell.tsx` — Avatar, Badge, Button, Dropdown compound
- Modify: `src/features/staff/components/StaffTable/PinCell.tsx` — Button
- Modify: `src/features/staff/components/StaffDetailHeader/index.tsx` — Avatar, Badge, Button, Chip, Divider→Separator, Dropdown, Tooltip
- Modify: `src/features/staff/components/StaffDetailFooter/index.tsx` — Button

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

Key changes:
- Table to compound pattern (see Task 5 reference)
- Badge wrapping: `<Badge content={x}><Avatar /></Badge>` → `<Badge.Anchor><Avatar /><Badge>{x}</Badge></Badge.Anchor>`
- Dropdown to compound pattern
- `Divider` → `Separator`
- Avatar to compound pattern

- [ ] **Step 3: Commit**

```bash
git add src/features/staff/components/StaffTable/ src/features/staff/components/StaffDetailHeader/ src/features/staff/components/StaffDetailFooter/ && git commit -m "refactor: migrate staff tables and headers to v3"
```

---

## Task 10: Migrate Staff Feature — Profile, Documents, Modals

**Files:**
- Modify: `src/features/staff/components/StaffProfileTab/index.tsx` — Many Select, Input, Chip, addToast→toast
- Modify: `src/features/staff/components/StaffDocumentsTab/index.tsx` — Table compound
- Modify: `src/features/staff/components/StaffDocumentsTab/renderCell.tsx` — Button, Chip, Dropdown
- Modify: `src/features/staff/components/AddStaffModal.tsx` — Modal compound, addToast→toast
- Modify: `src/features/staff/components/AddDocumentModal.tsx` — Modal compound, Select, addToast→toast
- Modify: `src/features/staff/components/DeleteDocumentModal.tsx` — Modal compound, Button, addToast→toast
- Modify: `src/features/staff/components/RegeneratePinModal.tsx` — Modal compound, Button, addToast→toast

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

Key changes:
- All `addToast({...})` calls → `toast("title", {...})` with v3 API
- Modal: `<Modal><ModalContent>{(onClose) => (...)}</ModalContent></Modal>` → `<Modal><Modal.Backdrop><Modal.Container><Modal.Dialog>...</Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>`
- Select: flat `<Select><SelectItem>` → compound `<Select><Select.Trigger>...<Select.Popover><ListBox><ListBox.Item>...`
- `text-tiny` → `text-xs` in StaffProfileTab

- [ ] **Step 3: Commit**

```bash
git add src/features/staff/ && git commit -m "refactor: migrate staff profile, documents, and modals to v3"
```

---

## Task 11: Migrate Staff Feature — AddStaffStepper

**Files:**
- Modify: `src/features/staff/components/AddStaffStepper/PersonalInfoStep.tsx` — DateInput→DateField, Input, Select, Textarea
- Modify: `src/features/staff/components/AddStaffStepper/StaffDetailsStep.tsx` — Avatar, Input, Select, Switch, `text-tiny`→`text-xs`
- Modify: `src/features/staff/components/AddStaffStepper/CertificationStep.tsx` — Input, Select
- Modify: `src/features/staff/components/AddStaffStepper/ScheduleStep.tsx` — Select
- Modify: `src/features/staff/components/AddStaffStepper/KindoraRoleStep.tsx` — DateInput→DateField, Select
- Modify: `src/features/staff/components/AddStaffStepper/EmergencyContactStep.tsx` — Input, Select
- Modify: `src/features/staff/components/AddStaffStepper/MedicalInfoStep.tsx` — Chip, Input
- Modify: `src/features/staff/components/AddStaffStepper/ConfirmStep.tsx` — Switch

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

Key changes:
- `DateInput` → `DateField` compound: `<DateField><Label>...</Label><DateField.Group><DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input></DateField.Group></DateField>`
- `Textarea` → check v3 `TextArea` component
- Switch to compound pattern
- Select to compound pattern
- `text-tiny` → `text-xs`

- [ ] **Step 3: Commit**

```bash
git add src/features/staff/components/AddStaffStepper/ && git commit -m "refactor: migrate AddStaffStepper to v3"
```

---

## Task 12: Migrate Students Feature

**Files:**
- Modify: `src/features/students/components/StudentsTable/index.tsx` — Table compound
- Modify: `src/features/students/components/StudentsTable/StudentsTableCell.tsx` — Avatar, Badge, Button, Chip, Dropdown, Tooltip
- Modify: `src/features/students/components/StudentsTable/ParentsAvatarGroup.tsx` — Avatar, AvatarGroup→flex, Tooltip
- Modify: `src/features/students/components/StudentsTable/ParentTooltipContent.tsx` — Avatar, Button, Divider→Separator
- Modify: `src/features/students/components/StudentsEmptyState.tsx` — Card compound
- Modify: `src/features/students/components/StudentDetailHeader/index.tsx` — Avatar, Badge, Button, Chip, Divider→Separator
- Modify: `src/features/students/components/StudentProfileTab/index.tsx` — Avatar, Card, Chip, Input, `text-tiny`→`text-xs`
- Modify: `src/features/students/components/StudentDocumentsTab/index.tsx` — Table compound
- Modify: `src/features/students/components/StudentDocumentsTab/renderCell.tsx` — Button, Chip, Dropdown
- Modify: `src/features/students/components/AddDocumentModal.tsx` — Modal, Select, addToast→toast
- Modify: `src/features/students/components/DeleteDocumentModal.tsx` — Modal, Button, addToast→toast

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

Key changes:
- `AvatarGroup` → `<div className="flex -space-x-2">` with individual Avatars + counter Avatar
- `Divider` → `Separator`
- `text-tiny` → `text-xs`
- All compound patterns as documented above

- [ ] **Step 3: Commit**

```bash
git add src/features/students/ && git commit -m "refactor: migrate students feature to v3"
```

---

## Task 13: Migrate Rooms Feature — Tables & Headers

**Files:**
- Modify: `src/features/rooms/components/RoomDetailHeader.tsx` — Avatar, Tab/Tabs, Tooltip compound
- Modify: `src/features/rooms/components/RoomsTable/index.tsx` — Table compound
- Modify: `src/features/rooms/components/RoomsTable/RoomsTableCell.tsx` — Avatar, Button, Dropdown, Tooltip
- Modify: `src/features/rooms/components/RoomsTable/SignedInAvatarGroup.tsx` — Avatar, AvatarGroup→flex, Tooltip
- Modify: `src/features/rooms/components/RoomsEmptyState.tsx` — Card compound
- Modify: `src/features/rooms/components/RoomStudentsTable/index.tsx` — Table compound, Selection type
- Modify: `src/features/rooms/components/RoomStudentsTable/renderCell.tsx` — Avatar, Badge, Chip
- Modify: `src/features/rooms/components/RoomStudentsTable/ParentsAvatarGroup.tsx` — Avatar, AvatarGroup→flex, Tooltip
- Modify: `src/features/rooms/components/RoomStudentsTable/StudentActionsDropdown.tsx` — Button, Dropdown, addToast→toast

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

- [ ] **Step 3: Commit**

```bash
git add src/features/rooms/components/RoomDetailHeader.tsx src/features/rooms/components/RoomsTable/ src/features/rooms/components/RoomsEmptyState.tsx src/features/rooms/components/RoomStudentsTable/ && git commit -m "refactor: migrate rooms tables and headers to v3"
```

---

## Task 14: Migrate Rooms Feature — Tabs & Modals

**Files:**
- Modify: `src/features/rooms/components/RoomTabs/RoomActivityTab.tsx` — Card compound
- Modify: `src/features/rooms/components/RoomTabs/RoomProfileTab.tsx` — Many Select, Avatar, Input, useInfiniteScroll, addToast→toast
- Modify: `src/features/rooms/components/AddRoomModal.tsx` — Modal, addToast→toast
- Modify: `src/features/rooms/components/AddRoomStepper/RoomDetailsStep.tsx` — Avatar, Input, NumberInput→NumberField, Select
- Modify: `src/features/rooms/components/AddRoomStepper/AddStaffStudentsStep.tsx` — Button, Select, Skeleton, useInfiniteScroll
- Modify: `src/features/rooms/components/AddRoomStepper/ConfirmRoomStep.tsx` — Avatar
- Modify: `src/features/rooms/components/DeactivateRoomModal.tsx` — Modal, Button, addToast→toast
- Modify: `src/features/rooms/components/ImagePickerModal.tsx` — Modal, Button, Tab/Tabs
- Modify: `src/features/rooms/components/TransferStudentModal.tsx` — Modal, Select, useInfiniteScroll
- Modify: `src/features/rooms/components/MarkAbsentModal.tsx` — Modal, Select, RangeValue type, DateRangePicker-related
- Modify: `src/features/rooms/components/AddStudentModal.tsx` — Modal, Select, useInfiniteScroll

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

Key changes:
- `NumberInput` → `NumberField` compound
- `useInfiniteScroll` from `@heroui/use-infinite-scroll` — check if this hook exists in v3 or needs replacement. If not available, implement manual infinite scroll with IntersectionObserver.
- `RangeValue` type — check if still exported from `@heroui/react` in v3
- Modal compound pattern throughout

- [ ] **Step 3: Commit**

```bash
git add src/features/rooms/ && git commit -m "refactor: migrate rooms tabs and modals to v3"
```

---

## Task 15: Migrate Calendar Feature

**Files:**
- Modify: `src/features/calendar/components/CalendarToolbar.tsx` — Button, ButtonGroup, Switch, Tab/Tabs
- Modify: `src/features/calendar/components/CalendarView.tsx` — Spinner, addToast→toast
- Modify: `src/features/calendar/components/EventModal.tsx` — Modal, Select, many form components, addToast→toast
- Modify: `src/features/calendar/components/DeleteEventModal.tsx` — Modal, Button, addToast→toast

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

Key changes:
- `ButtonGroup` — check v3 API (it exists in v3 component list)
- Switch to compound pattern
- Tabs to compound pattern
- Modal compound pattern
- All addToast → toast

- [ ] **Step 3: Commit**

```bash
git add src/features/calendar/ && git commit -m "refactor: migrate calendar feature to v3"
```

---

## Task 16: Migrate Messages Feature

**Files:**
- Modify: `src/features/messages/components/MessagesTabs.tsx` — Tab/Tabs
- Modify: `src/features/messages/components/MessagesConversationPane.tsx` — Avatar, Button, Chip, Input, ScrollShadow
- Modify: `src/features/messages/components/MessagesSidebar.tsx` — Button, Input

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

Key changes:
- Tabs compound pattern
- Avatar compound pattern
- ScrollShadow — same API in v3

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/ && git commit -m "refactor: migrate messages feature to v3"
```

---

## Task 17: Migrate Newsletters Feature

**Files:**
- Modify: `src/features/newsletters/components/NewslettersPage.tsx` — Tab/Tabs, useDisclosure→useOverlayState or useState
- Modify: `src/features/newsletters/components/NewslettersTable/index.tsx` — Table compound
- Modify: `src/features/newsletters/components/CreateNewsletterModal/index.tsx` — Modal, Button
- Modify: `src/features/newsletters/components/CreateNewsletterModal/Step1Editor.tsx` — Tab/Tabs
- Modify: `src/features/newsletters/components/CreateNewsletterModal/Step2Preview.tsx` — Card compound
- Modify: `src/features/newsletters/components/CreateNewsletterModal/TemplatesPanel.tsx` — Card compound
- Modify: `src/features/newsletters/components/CreateNewsletterModal/NewsletterEditor.tsx` — Button, Input, Popover, Tooltip
- Modify: `src/features/newsletters/components/CreateNewsletterModal/HeaderFooterButton.tsx` — Button, Tooltip

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

Key changes:
- `useDisclosure` → replace with `useState` for `isOpen`/`onOpen`/`onOpenChange` or use `useOverlayState` from v3
- Popover to compound pattern
- Tooltip to compound pattern
- Modal compound pattern

- [ ] **Step 3: Commit**

```bash
git add src/features/newsletters/ && git commit -m "refactor: migrate newsletters feature to v3"
```

---

## Task 18: Migrate Route Files & Drawer Store

**Files:**
- Modify: `src/routes/_authenticated/staff/$staffId.tsx` — Spinner, Tab/Tabs
- Modify: `src/routes/_authenticated/students/$studentId.tsx` — Spinner, Tab/Tabs
- Modify: `src/pages/HomePage.tsx` — Button
- Modify: `src/stores/drawer.store.ts` — DrawerProps type import

- [ ] **Step 1: Read all files**

- [ ] **Step 2: Migrate each file**

Key changes:
- Tabs compound pattern for route tab views
- `DrawerProps` type — check if still exported from `@heroui/react` in v3, or derive from v3 Drawer component props

- [ ] **Step 3: Commit**

```bash
git add src/routes/ src/pages/ src/stores/drawer.store.ts && git commit -m "refactor: migrate route files and drawer store to v3"
```

---

## Task 19: Styling Token Sweep

**Files:**
- Any file containing `text-tiny`, `text-small`, `text-medium`, `text-large`, `rounded-small`, `rounded-medium`, `rounded-large`, `content1-4`, `primary` color references that should be `accent`

- [ ] **Step 1: Search and replace styling tokens project-wide**

```bash
# Find all occurrences
grep -rn "text-tiny\|text-small\|text-medium\|text-large\|rounded-small\|rounded-medium\|rounded-large\|shadow-small" src/
```

Replace:
- `text-tiny` → `text-xs`
- `text-small` → `text-sm`
- `text-medium` → `text-base`
- `text-large` → `text-lg`
- `rounded-small` → `rounded-sm`
- `rounded-medium` → `rounded-md`
- `rounded-large` → `rounded-lg`
- `shadow-small` → `shadow-sm`

- [ ] **Step 1b: Audit `text-default-*`, `bg-default`, `border-default` color tokens**

These v2 tokens appear in ~60+ files. Check if they still resolve in v3's CSS variables. If they don't:
- `text-default-400` / `text-default-500` → `text-muted`
- `text-default-600` / `text-default-700` → `text-muted-foreground` or `text-foreground`
- `bg-default` / `bg-default-100` → `bg-surface` or `bg-surface-secondary`
- `border-default` / `border-default-200` → `border-divider` or keep if still valid

Run the dev server and check console for CSS resolution errors before doing a mass replace. If `default-*` tokens still work in v3 (they may via Tailwind color palette), leave them as-is and revisit in a follow-up.

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "style: update v2 styling tokens to v3 equivalents"
```

---

## Task 20: Typecheck, Lint, Fix & Final Verification

**Files:**
- Any remaining files with type errors

- [ ] **Step 1: Run typecheck**

```bash
bun run typecheck
```

Fix any remaining type errors. Common issues:
- Missing `id` prop on collection items (Dropdown.Item, ListBox.Item, Table.Row)
- Missing `textValue` prop on items with non-text content
- Changed prop names or removed props
- Import paths that no longer exist

- [ ] **Step 2: Run lint/format check and fix**

```bash
bun run fix
bun run check
```

- [ ] **Step 3: Verify dev server starts**

```bash
bun run dev
```

Manually verify key pages render without errors:
- Login page
- Staff list and detail pages
- Students list and detail pages
- Rooms list and detail pages
- Calendar page
- Messages page
- Newsletters page

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "fix: resolve remaining v3 migration type errors and lint issues"
```

---

## Notes for Implementers

1. **useInfiniteScroll** (4 files: `RoomProfileTab`, `TransferStudentModal`, `AddStudentModal`, `AddStaffStudentsStep`): The `@heroui/use-infinite-scroll` package may not exist in v3. Check if the hook is bundled in `@heroui/react`. If not, replace with a simple IntersectionObserver pattern:
   ```tsx
   const observerRef = useRef<HTMLDivElement>(null)
   useEffect(() => {
     if (!observerRef.current || !hasMore) return
     const observer = new IntersectionObserver(
       ([entry]) => { if (entry.isIntersecting) fetchNextPage() },
       { threshold: 0.5 }
     )
     observer.observe(observerRef.current)
     return () => observer.disconnect()
   }, [hasMore, fetchNextPage])
   // Place <div ref={observerRef} /> at the bottom of the scrollable list
   ```

2. **Selection type**: `Selection` from `@heroui/react` should still be available in v3 since it's a React Aria type. If not, import from `react-aria-components`.

3. **RangeValue type**: Same as Selection — check availability. May need to import from `@internationalized/date` or `react-aria-components`.

4. **addToast → toast**: The v3 toast API is `toast("message", options)` instead of `addToast({ title, description, color })`. The options shape is different — check v3 Toast docs for exact API.

5. **Modal controlled state**: v2 used `isOpen`/`onOpenChange` on the `<Modal>` component. v3 may use the same props — verify during implementation.

6. **Select onSelectionChange**: v2 passed `"all" | Set<Key>`. v3 may have a different callback signature — verify during implementation.

7. **classNames prop** (~46 files): Many v2 components accepted `classNames={{ base: "...", content: "..." }}`. In v3, style sub-components directly via their `className` prop. For example:
   - `classNames={{ base: "..." }}` → put on the root component's `className`
   - `classNames={{ content: "..." }}` → put on the `Card.Content` / `Modal.Body` etc. `className`
   - `classNames={{ trigger: "..." }}` → put on the `Select.Trigger` / `Dropdown.Trigger` etc. `className`
   - `classNames={{ label: "..." }}` → put on the `<Label className="...">` component

8. **Don't fight the framework**: If a v3 component's default styling differs from v2, prefer accepting v3 defaults unless it breaks the design significantly. The goal is a working migration, not pixel-perfect preservation.
