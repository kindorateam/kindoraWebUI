# Messages UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `/messages` screen into a calmer HeroUI v3 workspace with a responsive mobile conversation state.

**Architecture:** Keep the existing feature-local messages structure and mock data, but refactor the view into focused surfaces: a filterable thread list, a conversation pane, and a mobile-only conversation state. Extend the messages hook to manage selection and mobile view transitions while leaving the route and data model intact.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, HeroUI v3, TanStack Router

---

### Task 1: Reshape messages state for responsive behavior

**Files:**
- Modify: `src/features/messages/hooks/useMessages.ts`
- Modify: `src/features/messages/types.ts`

- [ ] **Step 1: Add the failing behavior definition in the plan**

The hook needs to expose a mobile conversation state without breaking desktop selection behavior. The expected API after the change is:

```ts
return {
	activeTab,
	searchValue,
	selectedThread,
	selectedThreadId,
	isMobileConversationOpen,
	setActiveTab,
	setSearchValue,
	handleThreadSelect,
	handleBackToList,
	visibleThreads,
}
```

- [ ] **Step 2: Implement the minimal state update**

Update `useMessages.ts` so selecting a thread opens the conversation state and going back closes it:

```ts
const [selectedThreadId, setSelectedThreadId] = useState("thread-4");
const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);

const handleThreadSelect = (threadId: string) => {
	setSelectedThreadId(threadId);
	setIsMobileConversationOpen(true);
};

const handleBackToList = () => {
	setIsMobileConversationOpen(false);
};
```

- [ ] **Step 3: Keep selection fallback behavior predictable**

Preserve the selected-thread lookup against filtered data and keep the current desktop fallback:

```ts
const selectedFromVisible = visibleThreads.find((item) => item.id === selectedThreadId);
const selectedThread = selectedFromVisible ?? visibleThreads[0] ?? null;
```

- [ ] **Step 4: Run typecheck for the hook change**

Run: `bun run typecheck`

Expected: exit code `0`

### Task 2: Rebuild the page layout and thread list surface

**Files:**
- Modify: `src/features/messages/components/MessagesPage.tsx`
- Modify: `src/features/messages/components/MessagesTabs.tsx`
- Modify: `src/features/messages/components/MessagesSidebar.tsx`
- Modify: `src/features/messages/components/ThreadCard.tsx`

- [ ] **Step 1: Update the page shell for separate desktop and mobile states**

Use a neutral page container and conditional rendering:

```tsx
<div className="flex h-[calc(100vh-112px)] flex-col gap-4 px-4 py-4 lg:px-6">
	<div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
		<div className={isMobileConversationOpen ? "hidden lg:flex" : "flex"}>
			...
		</div>
		<div className={isMobileConversationOpen ? "flex" : "hidden lg:flex"}>
			...
		</div>
	</div>
</div>
```

- [ ] **Step 2: Simplify tabs to default HeroUI semantics**

Use `Tabs` with minimal layout styling and no custom indicator color logic beyond sizing:

```tsx
<Tabs selectedKey={activeTab} onSelectionChange={(key) => onSelectionChange(key as MessageTab)}>
	<Tabs.List aria-label="Messages tabs">
		<Tabs.Tab id="all">All messages</Tabs.Tab>
		<Tabs.Tab id="favorites">Favorites</Tabs.Tab>
	</Tabs.List>
</Tabs>
```

- [ ] **Step 3: Rebuild the sidebar as a dedicated surface**

Wrap the search and list area in a bordered panel and keep the list scrollable:

```tsx
<section className="flex h-full min-h-0 flex-col rounded-2xl border border-default-200 bg-content1 p-3">
	...
</section>
```

- [ ] **Step 4: Rebuild thread cards for scanability**

Use HeroUI defaults for avatar and badge-like metadata, and reduce custom colors:

```tsx
<button
	className={clsx(
		"flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
		isSelected ? "border-primary bg-primary/10" : "border-transparent hover:bg-default-100",
	)}
	type="button"
	onClick={() => onPress(item.id)}
>
```

- [ ] **Step 5: Run lint and typecheck after the layout changes**

Run: `bun run typecheck && bun run check`

Expected: both commands exit `0`

### Task 3: Rebuild the conversation pane and message composer

**Files:**
- Modify: `src/features/messages/components/MessagesConversationPane.tsx`
- Modify: `src/features/messages/components/ConversationBubble.tsx`
- Potentially modify: `src/index.css`

- [ ] **Step 1: Add a mobile-aware conversation header**

Render a back button on mobile and a compact thread summary:

```tsx
{showBackButton ? (
	<Button startContent={<... />} variant="light" onPress={onBack}>
		Back
	</Button>
) : null}
```

- [ ] **Step 2: Replace the blue-heavy conversation shell with a neutral surface**

Use a bordered panel with internal layout:

```tsx
<section className="flex h-full min-h-0 flex-col rounded-2xl border border-default-200 bg-content1">
	<header className="border-b border-default-200 px-4 py-3">...</header>
	<ScrollShadow className="messages-chat-scroll flex-1 px-4 py-4">...</ScrollShadow>
	<footer className="border-t border-default-200 p-3">...</footer>
</section>
```

- [ ] **Step 3: Normalize bubble spacing and contrast**

Use restrained, role-based styling:

```tsx
<div
	className={clsx(
		"max-w-[min(32rem,85%)] rounded-2xl px-4 py-3 text-sm",
		isRight ? "bg-primary text-primary-foreground" : "bg-default-100 text-foreground",
	)}
>
```

- [ ] **Step 4: Add empty-state behavior**

If no thread is selected, render a simple empty state instead of an incomplete pane.

- [ ] **Step 5: Run full verification**

Run:

```bash
bun run typecheck
bun run check
```

Expected: both commands exit `0`
