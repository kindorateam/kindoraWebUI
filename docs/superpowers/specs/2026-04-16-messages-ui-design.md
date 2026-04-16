# Messages UI Redesign

Date: 2026-04-16
Scope: `/messages` screen only
Status: proposed

## Summary

Redesign the `/messages` page into a clearer messaging workspace using default HeroUI v3 primitives and library color tokens. Keep the existing route and mock data model, but rebuild the layout hierarchy, thread list presentation, conversation pane, and mobile behavior so the screen feels like a standard messaging product instead of a custom one-off composition.

This redesign does not introduce new messaging features. It focuses on structure, readability, responsiveness, and better use of the existing HeroUI surface patterns.

## Problems In The Current Screen

- The page relies on a strong full-canvas blue background that overpowers the content and reduces hierarchy.
- Sidebar, conversation header, message bubbles, and composer all use different custom shapes and fills, so the screen feels visually inconsistent.
- The desktop two-pane layout does not degrade into a usable mobile messaging flow.
- Thread cards do not scan cleanly because metadata, preview text, favorites, and unread state compete within the same narrow space.
- The conversation pane lacks a strong empty state and depends on visual styling rather than layout for clarity.

## Goals

- Use default HeroUI v3 components and default library color roles wherever possible.
- Reduce custom colors and remove the full-page blue treatment from the messages screen.
- Make the desktop layout feel like a calm two-pane workspace.
- Make mobile behave like a messaging app: list first, conversation second, with a dedicated mobile conversation state.
- Preserve the current mock data structure and route shape.

## Non-Goals

- No app-wide HeroUI migration. The app is already on HeroUI v3.
- No backend or service integration changes.
- No new features such as sending, attachments, favorites toggling, or live updates.
- No redesign of newsletters or unrelated shared pages.

## Recommended Approach

Keep the existing desktop sidebar plus conversation split, but rebuild the page with restrained HeroUI defaults:

- a neutral page background
- a separate sidebar surface and conversation surface
- calmer spacing and borders
- compact header and composer treatments
- clearer thread list information density

On mobile, stop trying to preserve the desktop split. Instead, introduce a view-state model:

- default state: thread list
- selected state: conversation view
- conversation view includes a back button

This keeps the current architecture small while fixing the main UX problem.

## Information Architecture

### Desktop

The page is composed of two columns:

1. Left column
   - tabs
   - search
   - thread list

2. Right column
   - conversation header
   - message history
   - message composer

The right column should occupy the primary visual weight. The left column should remain readable but secondary.

### Mobile

The page becomes a single-surface flow with two explicit states:

1. List state
   - tabs
   - search
   - thread list

2. Conversation state
   - back button plus participant summary
   - message history
   - composer

Switching between states is driven entirely by local selection state.

## Component Changes

### `MessagesPage`

- Replace the current blue-heavy layout shell with a neutral container that uses spacing and grid, not background color, to establish hierarchy.
- Add responsive mobile state handling so the list and conversation views can render independently below the desktop breakpoint.
- Keep `useMessages` as the main page hook, but extend it with lightweight mobile view state if needed.

### `MessagesTabs`

- Keep HeroUI `Tabs`.
- Remove custom high-contrast tab styling and rely on default tab semantics with only minimal sizing adjustments.
- The control should read as a lightweight filter, not a hero control.

### `MessagesSidebar`

- Use a dedicated surface with border, radius, and internal spacing.
- Keep the search input and action button at the top, but simplify custom styling.
- Make the list area scroll independently.
- Add empty-state support when search returns no results.

### `ThreadCard`

- Rebuild each row as a clearer thread preview item:
  - avatar
  - name
  - preview
  - timestamp
  - unread badge
  - favorite icon
- Use subtle selected and hover states with default roles rather than bespoke fills.
- Improve preview truncation and spacing so metadata stays legible.

### `MessagesConversationPane`

- Use a separate surface for the conversation area.
- Simplify the top header into a compact bar with:
  - avatar
  - participant name
  - parent chips
  - secondary action buttons
- Keep `ScrollShadow` for message history.
- Add a neutral empty state for cases where no thread is selected.

### `ConversationBubble`

- Keep left/right alignment, but normalize bubble radius, padding, max width, and time label spacing.
- Use library roles for bubble contrast instead of the current custom pale-blue and saturated-primary pairing where possible.
- Preserve multiline rendering.

### Composer

- Keep the bottom composer fixed within the conversation surface.
- Use HeroUI input and button defaults with minimal layout styling.
- Attachment button, text input, and send button should form one compact horizontal row on desktop and remain touch-friendly on mobile.

## State Model

Current state:

- `activeTab`
- `searchValue`
- `selectedThreadId`

Proposed additions:

- `isMobileConversationOpen` or equivalent derived view-state for small screens

Behavior:

- Selecting a thread on desktop updates the active conversation in place.
- Selecting a thread on mobile opens the conversation state.
- Back button on mobile returns to the thread list without losing selected thread context.
- Filtering can reduce the visible thread set. If the selected thread is filtered out, the hook may fall back to the first visible thread for desktop while mobile can remain in list state until the user reopens a thread.

## Styling Principles

- Prefer HeroUI defaults over custom fills, shadows, and color hex values.
- Use spacing, borders, and surface separation before adding strong color.
- Keep only one primary accent role visible at a time.
- Avoid decorative backgrounds on operational UI.
- Let typography and grouping create structure.

## Accessibility And Interaction

- Thread rows remain real buttons with visible selected state.
- Mobile back action must be keyboard and screen-reader accessible.
- Search input and composer input need clear labels or `aria-label`.
- Message area should remain scrollable without trapping focus.
- Empty states should explain what to do next.

## Testing And Validation

### Functional

- Tabs filter the visible thread list correctly.
- Search filters threads correctly.
- Selecting a thread updates the conversation pane.
- Mobile selection opens the conversation state.
- Mobile back returns to the list state.
- Empty-state rendering works for:
  - no thread selected
  - no search results

### Responsive

- Desktop: two-pane layout remains stable at large widths.
- Tablet: layout remains readable without overlap.
- Mobile: list and conversation do not render as competing stacked panes.

### Visual

- Screen no longer relies on the blue background to define layout.
- Surfaces, borders, and spacing feel consistent with HeroUI defaults.
- Thread rows scan quickly.
- Composer remains anchored and readable.

## Files Expected To Change

- `src/features/messages/components/MessagesPage.tsx`
- `src/features/messages/components/MessagesTabs.tsx`
- `src/features/messages/components/MessagesSidebar.tsx`
- `src/features/messages/components/ThreadCard.tsx`
- `src/features/messages/components/MessagesConversationPane.tsx`
- `src/features/messages/components/ConversationBubble.tsx`
- `src/features/messages/hooks/useMessages.ts`

Potentially:

- `src/features/messages/types.ts`
- `src/index.css` if the existing custom scroll helpers need cleanup

## Implementation Notes

- Keep the solution incremental and localized to the messages feature.
- Do not introduce a global layout abstraction for this one screen.
- Remove custom color literals where a HeroUI default role already covers the use case.
- If a component becomes oversized during the refactor, split it into a small child component rather than adding more prop switches.
