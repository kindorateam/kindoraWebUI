# Meal Planner Calendar Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate meal planner domain and expose meals in the existing calendar as an optional display layer.

**Architecture:** Meals are not generic calendar events. `src/features/meals` owns meal CRUD, meal types, meal-specific service calls, and planner UI. `src/features/calendar` remains the visual scheduling surface and consumes meal data only through a small transformation layer.

**Tech Stack:** React 19, TypeScript strict, TanStack Query, TanStack Router, Jotai, HeroUI, FullCalendar, react-i18next, Biome.

---

## File Structure

- Create `src/features/meals/types.ts`
  - Owns meal domain types and API payloads.
- Create `src/features/meals/constants.ts`
  - Owns meal type options, colors, and default serving times.
- Create `src/features/meals/services/meal.service.ts`
  - Owns meal data access. Start with the same in-memory mock style as the current calendar service if backend endpoints are not ready; keep exported functions shaped like API calls so replacing internals with `apiClient` is direct.
- Create `src/features/meals/hooks/useMeals.ts`
  - Owns TanStack Query hooks for meal plans.
- Create `src/features/meals/utils/mealCalendar.ts`
  - Converts `MealPlan` into calendar-layer display items.
- Create `src/features/meals/components/MealPlanModal.tsx`
  - Create/edit meal plan form.
- Create `src/features/meals/components/MealDetailsModal.tsx`
  - Read-only meal detail modal used from calendar clicks.
- Create `src/features/meals/components/MealsPage.tsx`
  - Separate meal planner page.
- Create `src/routes/_authenticated/meals.tsx`
  - Route for the planner page.
- Modify `src/features/calendar/types.ts`
  - Add a discriminated display item shape so calendar clicks can route meals to meal details and events to event details.
- Modify `src/features/calendar/stores/calendarSettings.store.ts`
  - Add a persisted `showMealsAtom`.
- Modify `src/features/calendar/components/CalendarToolbar.tsx`
  - Add a `Meals` layer switch next to `Hide weekends`.
- Modify `src/features/calendar/components/CalendarView.tsx`
  - Fetch meals for `dateRange`, merge calendar events with meal display events, and open the right modal on click.
- Modify `src/features/calendar/components/CalendarEventContent.tsx`
  - Render meal items differently without changing API data.
- Modify `src/features/calendar/components/calendar.css`
  - Add meal event styling.
- Modify `src/i18n/locales/en.ts` and `src/i18n/locales/es.ts`
  - Add meal planner and calendar layer labels.
- Modify navigation source if needed, likely `src/constants/navDrawerData.ts` or the existing nav data file found by `rg -n "Calendar|calendar" src`.
  - Add a `Meals` page link only if product wants meal planner in primary navigation.

---

### Task 1: Define Meal Domain Types And Constants

**Files:**
- Create: `src/features/meals/types.ts`
- Create: `src/features/meals/constants.ts`

- [ ] **Step 1: Add meal types**

Create `src/features/meals/types.ts`:

```ts
export type MealType = "breakfast" | "lunch" | "snack"

export interface MealPlan {
	id: string
	date: string
	mealType: MealType
	title: string
	items: string[]
	allergens: string[]
	roomIds: string[]
	notes?: string
	servedAt: string
}

export interface GetMealPlansParams {
	start: string
	end: string
}

export interface CreateMealPlanPayload {
	date: string
	mealType: MealType
	title: string
	items: string[]
	allergens: string[]
	roomIds: string[]
	notes?: string
	servedAt: string
}

export type UpdateMealPlanPayload = Partial<CreateMealPlanPayload>
```

- [ ] **Step 2: Add constants**

Create `src/features/meals/constants.ts`:

```ts
import type { MealType } from "./types"

export const MEAL_TYPE_OPTIONS: { key: MealType; labelKey: string }[] = [
	{ key: "breakfast", labelKey: "meals.types.breakfast" },
	{ key: "lunch", labelKey: "meals.types.lunch" },
	{ key: "snack", labelKey: "meals.types.snack" },
]

export const MEAL_TYPE_COLORS: Record<MealType, string> = {
	breakfast: "#F5A524",
	lunch: "#17C964",
	snack: "#7828C8",
}

export const DEFAULT_MEAL_TIMES: Record<MealType, string> = {
	breakfast: "08:30",
	lunch: "11:30",
	snack: "15:00",
}
```

- [ ] **Step 3: Verify**

Run:

```bash
bun run typecheck
bun run check
```

Expected: both commands pass.

- [ ] **Step 4: Commit**

```bash
git add src/features/meals/types.ts src/features/meals/constants.ts
git commit -m "feat(meals): add meal planning domain types"
```

---

### Task 2: Add Meal Data Access And Query Hooks

**Files:**
- Create: `src/features/meals/services/meal.service.ts`
- Create: `src/features/meals/hooks/useMeals.ts`

- [ ] **Step 1: Add meal service**

Create `src/features/meals/services/meal.service.ts`:

```ts
import type { CreateMealPlanPayload, GetMealPlansParams, MealPlan, UpdateMealPlanPayload } from "../types"

const toLocalDateString = (date: Date): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const toLocalDateTimeString = (date: Date, time: string): string => `${toLocalDateString(date)}T${time}:00`

const addDays = (date: Date, days: number): Date => {
	const nextDate = new Date(date)
	nextDate.setDate(nextDate.getDate() + days)
	return nextDate
}

const parseDateValue = (value: string): Date => {
	if (value.length === 10) {
		return new Date(`${value}T00:00:00`)
	}

	return new Date(value)
}

const generateMealPlanId = (): string => globalThis.crypto?.randomUUID?.() ?? `meal-${Date.now()}`

const createMockMealPlans = (): MealPlan[] => {
	const today = new Date()

	return [
		{
			id: "meal-1",
			date: toLocalDateString(today),
			mealType: "breakfast",
			title: "Oatmeal, bananas, milk",
			items: ["Oatmeal", "Bananas", "Milk"],
			allergens: ["Milk"],
			roomIds: [],
			servedAt: toLocalDateTimeString(today, "08:30"),
		},
		{
			id: "meal-2",
			date: toLocalDateString(today),
			mealType: "lunch",
			title: "Pasta, peas, fruit",
			items: ["Pasta", "Peas", "Fruit"],
			allergens: ["Wheat"],
			roomIds: [],
			notes: "Use gluten-free pasta for restricted diets.",
			servedAt: toLocalDateTimeString(today, "11:30"),
		},
		{
			id: "meal-3",
			date: toLocalDateString(addDays(today, 1)),
			mealType: "snack",
			title: "Yogurt and berries",
			items: ["Yogurt", "Berries"],
			allergens: ["Milk"],
			roomIds: [],
			servedAt: toLocalDateTimeString(addDays(today, 1), "15:00"),
		},
	]
}

let mockMealPlans = createMockMealPlans()

const sortMealPlans = (mealPlans: MealPlan[]): MealPlan[] => {
	return [...mealPlans].sort((left, right) => parseDateValue(left.servedAt).getTime() - parseDateValue(right.servedAt).getTime())
}

const overlapsRange = (mealPlan: MealPlan, range: GetMealPlansParams): boolean => {
	const servedAt = parseDateValue(mealPlan.servedAt)
	const rangeStart = parseDateValue(range.start)
	const rangeEnd = parseDateValue(range.end)

	return servedAt >= rangeStart && servedAt < rangeEnd
}

export const getMealPlans = async (params: GetMealPlansParams): Promise<MealPlan[]> => {
	return sortMealPlans(mockMealPlans.filter((mealPlan) => overlapsRange(mealPlan, params)))
}

export const createMealPlan = async (payload: CreateMealPlanPayload): Promise<MealPlan> => {
	const mealPlan: MealPlan = {
		id: generateMealPlanId(),
		...payload,
	}

	mockMealPlans = sortMealPlans([...mockMealPlans, mealPlan])

	return mealPlan
}

export const updateMealPlan = async (mealPlanId: string, payload: UpdateMealPlanPayload): Promise<MealPlan> => {
	const mealPlanIndex = mockMealPlans.findIndex((mealPlan) => mealPlan.id === mealPlanId)

	if (mealPlanIndex === -1) {
		throw new Error("Meal plan not found")
	}

	const existingMealPlan = mockMealPlans[mealPlanIndex]

	if (!existingMealPlan) {
		throw new Error("Meal plan not found")
	}

	const updatedMealPlan: MealPlan = {
		...existingMealPlan,
		...payload,
	}

	mockMealPlans = sortMealPlans(mockMealPlans.map((mealPlan, index) => (index === mealPlanIndex ? updatedMealPlan : mealPlan)))

	return updatedMealPlan
}

export const deleteMealPlan = async (mealPlanId: string): Promise<void> => {
	mockMealPlans = mockMealPlans.filter((mealPlan) => mealPlan.id !== mealPlanId)
}
```

When backend endpoints are ready, replace only this service body with `apiClient.get/post/patch/delete` calls and preserve the exported function signatures.

- [ ] **Step 2: Add query hooks**

Create `src/features/meals/hooks/useMeals.ts`:

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createMealPlan, deleteMealPlan, getMealPlans, updateMealPlan } from "../services/meal.service"

import type { CreateMealPlanPayload, GetMealPlansParams, UpdateMealPlanPayload } from "../types"

export const useMealPlans = (params: GetMealPlansParams, enabled = true) => {
	return useQuery({
		queryKey: ["meal-plans", params.start, params.end],
		queryFn: () => getMealPlans(params),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		enabled: enabled && !!params.start && !!params.end,
	})
}

export const useCreateMealPlan = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateMealPlanPayload) => createMealPlan(payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["meal-plans"] })
		},
	})
}

export const useUpdateMealPlan = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ mealPlanId, payload }: { mealPlanId: string; payload: UpdateMealPlanPayload }) =>
			updateMealPlan(mealPlanId, payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["meal-plans"] })
		},
	})
}

export const useDeleteMealPlan = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (mealPlanId: string) => deleteMealPlan(mealPlanId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["meal-plans"] })
		},
	})
}
```

- [ ] **Step 3: Verify**

Run:

```bash
bun run typecheck
bun run check
```

Expected: both commands pass.

- [ ] **Step 4: Commit**

```bash
git add src/features/meals/services/meal.service.ts src/features/meals/hooks/useMeals.ts
git commit -m "feat(meals): add meal planning data hooks"
```

---

### Task 3: Add Meal Calendar Transformation

**Files:**
- Modify: `src/features/calendar/types.ts`
- Create: `src/features/meals/utils/mealCalendar.ts`

- [ ] **Step 1: Extend calendar event display metadata**

In `src/features/calendar/types.ts`, extend `CalendarEvent`:

```ts
export type CalendarDisplayKind = "event" | "meal"

export interface CalendarEvent {
	id: string
	title: string
	description?: string
	start: string
	end: string
	allDay: boolean
	color?: string
	repeatFrequency?: EventRepeatFrequency
	excludedDates?: string[]
	displayKind?: CalendarDisplayKind
	sourceId?: string
	mealType?: import("@/features/meals/types").MealType
	allergens?: string[]
	items?: string[]
}
```

Keep `displayKind` optional so existing event mock data does not need a migration; missing value means `"event"`.

- [ ] **Step 2: Add meal-to-calendar transformer**

Create `src/features/meals/utils/mealCalendar.ts`:

```ts
import { MEAL_TYPE_COLORS } from "../constants"

import type { CalendarEvent } from "@/features/calendar/types"
import type { MealPlan } from "../types"

const MEAL_EVENT_DURATION_MINUTES = 30

const addMinutes = (date: Date, minutes: number): Date => {
	const nextDate = new Date(date)
	nextDate.setMinutes(nextDate.getMinutes() + minutes)
	return nextDate
}

const toLocalDateTimeString = (date: Date): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(
		date.getHours(),
	).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00`
}

export const mealPlanToCalendarEvent = (mealPlan: MealPlan): CalendarEvent => {
	const startDate = new Date(mealPlan.servedAt)

	return {
		id: `meal:${mealPlan.id}`,
		sourceId: mealPlan.id,
		displayKind: "meal",
		mealType: mealPlan.mealType,
		title: mealPlan.title,
		description: mealPlan.notes,
		start: mealPlan.servedAt,
		end: toLocalDateTimeString(addMinutes(startDate, MEAL_EVENT_DURATION_MINUTES)),
		allDay: false,
		color: MEAL_TYPE_COLORS[mealPlan.mealType],
		allergens: mealPlan.allergens,
		items: mealPlan.items,
	}
}

export const mealPlansToCalendarEvents = (mealPlans: MealPlan[]): CalendarEvent[] => {
	return mealPlans.map(mealPlanToCalendarEvent)
}
```

- [ ] **Step 3: Verify**

Run:

```bash
bun run typecheck
bun run check
```

Expected: both commands pass.

- [ ] **Step 4: Commit**

```bash
git add src/features/calendar/types.ts src/features/meals/utils/mealCalendar.ts
git commit -m "feat(calendar): map meal plans into calendar items"
```

---

### Task 4: Add Calendar Meal Layer Toggle And Rendering

**Files:**
- Modify: `src/features/calendar/stores/calendarSettings.store.ts`
- Modify: `src/features/calendar/components/CalendarToolbar.tsx`
- Modify: `src/features/calendar/components/CalendarView.tsx`
- Modify: `src/features/calendar/components/CalendarEventContent.tsx`
- Modify: `src/features/calendar/components/calendar.css`

- [ ] **Step 1: Add persisted layer state**

In `src/features/calendar/stores/calendarSettings.store.ts`, add:

```ts
export const showMealsAtom = atomWithStorage<boolean>("calendar-show-meals", true)
```

- [ ] **Step 2: Pass meal toggle through toolbar props**

In `src/features/calendar/components/CalendarToolbar.tsx`, add props:

```ts
	showMeals: boolean
	onShowMealsChange: (isSelected: boolean) => void
```

Then add this `Switch` near `Hide weekends`:

```tsx
<Switch size="sm" isSelected={showMeals} onChange={onShowMealsChange}>
	<Switch.Control>
		<Switch.Thumb />
	</Switch.Control>
	<Switch.Content>
		<Label className="text-default-600">{t("calendar.toolbar.showMeals")}</Label>
	</Switch.Content>
</Switch>
```

- [ ] **Step 3: Fetch meals and merge layer in CalendarView**

In `src/features/calendar/components/CalendarView.tsx`, import:

```ts
import { useMealPlans } from "@/features/meals/hooks/useMeals"
import { mealPlansToCalendarEvents } from "@/features/meals/utils/mealCalendar"
import { showMealsAtom } from "../stores/calendarSettings.store"
```

Add state:

```ts
const [showMeals, setShowMeals] = useAtom(showMealsAtom)
```

Fetch meals:

```ts
const { data: mealPlans = [] } = useMealPlans(
	{
		start: dateRange.start,
		end: dateRange.end,
	},
	showMeals,
)

const visibleCalendarItems = showMeals ? [...events, ...mealPlansToCalendarEvents(mealPlans)] : events
```

Pass `visibleCalendarItems` to `CalendarFullView`.

Update `CalendarToolbar` usage:

```tsx
<CalendarToolbar
	title={title}
	onNavigatePrev={handleToolbarNavigatePrev}
	onNavigateNext={handleToolbarNavigateNext}
	onNavigateToday={handleToolbarNavigateToday}
	hideWeekends={hideWeekends}
	onHideWeekendsChange={handleHideWeekendsChange}
	showMeals={showMeals}
	onShowMealsChange={setShowMeals}
/>
```

- [ ] **Step 4: Route clicks by display kind**

In `handleEventClick`, branch before opening event modal:

```ts
if (clickInfo.event.extendedProps.displayKind === "meal") {
	const mealPlanId = String(clickInfo.event.extendedProps.sourceId ?? "")
	const mealPlan = mealPlans.find((item) => item.id === mealPlanId)

	if (mealPlan) {
		openMealDetailsModal(mealPlan)
	}

	return
}
```

Create `openMealDetailsModal` in Task 5 before wiring this step if the modal store does not exist yet.

- [ ] **Step 5: Render meals with a compact meal style**

In `src/features/calendar/components/CalendarEventContent.tsx`, before the regular time-grid return:

```tsx
if (eventInfo.event.extendedProps.displayKind === "meal") {
	return (
		<div className="calendar-event-meal" style={style}>
			<span className="calendar-event-meal__type">{eventInfo.timeText}</span>
			<span className="calendar-event-meal__title">{eventInfo.event.title}</span>
		</div>
	)
}
```

In `src/features/calendar/components/calendar.css`, add:

```css
.calendar-event-meal {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	min-width: 0;
	height: 100%;
	padding: 0 0.5rem;
	color: #27272a;
}

.calendar-event-meal__type {
	flex: 0 0 auto;
	font-variant-numeric: tabular-nums;
	font-size: 0.625rem;
	font-weight: 750;
	line-height: 1;
	color: #52525b;
}

.calendar-event-meal__title {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 0.6875rem;
	font-weight: 700;
	line-height: 1;
}
```

- [ ] **Step 6: Verify**

Run:

```bash
bun run typecheck
bun run check
```

Expected: both commands pass.

Open `https://localhost:5173/calendar` and verify:
- Meals appear when `Meals` layer is on.
- Meals disappear when `Meals` layer is off.
- Clicking a normal event still opens `EventModal`.
- Clicking a meal opens `MealDetailsModal`.

- [ ] **Step 7: Commit**

```bash
git add src/features/calendar/stores/calendarSettings.store.ts src/features/calendar/components/CalendarToolbar.tsx src/features/calendar/components/CalendarView.tsx src/features/calendar/components/CalendarEventContent.tsx src/features/calendar/components/calendar.css
git commit -m "feat(calendar): add meals display layer"
```

---

### Task 5: Add Meal Details Modal

**Files:**
- Create: `src/features/meals/stores/mealDetailsModal.store.ts`
- Create: `src/features/meals/components/MealDetailsModal.tsx`
- Modify: `src/features/calendar/components/CalendarPage.tsx`

- [ ] **Step 1: Add modal store**

Create `src/features/meals/stores/mealDetailsModal.store.ts`:

```ts
import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

import type { MealPlan } from "../types"

interface MealDetailsModalState {
	isOpen: boolean
	mealPlan: MealPlan | null
}

export const mealDetailsModalAtom = atom<MealDetailsModalState>({
	isOpen: false,
	mealPlan: null,
})

export const openMealDetailsModal = (mealPlan: MealPlan) => {
	appStore.set(mealDetailsModalAtom, {
		isOpen: true,
		mealPlan,
	})
}

export const closeMealDetailsModal = () => {
	appStore.set(mealDetailsModalAtom, {
		isOpen: false,
		mealPlan: null,
	})
}
```

- [ ] **Step 2: Add details modal**

Create `src/features/meals/components/MealDetailsModal.tsx`:

```tsx
import { Button, Chip, Dialog, Label } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { closeMealDetailsModal, mealDetailsModalAtom } from "../stores/mealDetailsModal.store"

const MealDetailsModal = () => {
	const { t } = useTranslation()
	const { isOpen, mealPlan } = useAtomValue(mealDetailsModalAtom)

	return (
		<Dialog isOpen={isOpen} onOpenChange={(open) => !open && closeMealDetailsModal()}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>{mealPlan?.title ?? t("meals.details.title")}</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body className="space-y-4">
					{mealPlan && (
						<>
							<div className="grid gap-1">
								<Label className="text-default-500 text-xs">{t("meals.fields.type")}</Label>
								<p className="font-medium text-sm">{t(`meals.types.${mealPlan.mealType}`)}</p>
							</div>
							<div className="grid gap-1">
								<Label className="text-default-500 text-xs">{t("meals.fields.items")}</Label>
								<div className="flex flex-wrap gap-1.5">
									{mealPlan.items.map((item) => (
										<Chip key={item} size="sm" variant="soft">
											{item}
										</Chip>
									))}
								</div>
							</div>
							<div className="grid gap-1">
								<Label className="text-default-500 text-xs">{t("meals.fields.allergens")}</Label>
								<div className="flex flex-wrap gap-1.5">
									{mealPlan.allergens.length > 0 ? (
										mealPlan.allergens.map((allergen) => (
											<Chip color="danger" key={allergen} size="sm" variant="soft">
												{allergen}
											</Chip>
										))
									) : (
										<span className="text-default-500 text-sm">{t("meals.details.noAllergens")}</span>
									)}
								</div>
							</div>
							{mealPlan.notes && (
								<div className="grid gap-1">
									<Label className="text-default-500 text-xs">{t("meals.fields.notes")}</Label>
									<p className="text-sm">{mealPlan.notes}</p>
								</div>
							)}
						</>
					)}
				</Dialog.Body>
				<Dialog.Footer>
					<Button variant="secondary" onPress={closeMealDetailsModal}>
						{t("common.close")}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog>
	)
}

export default MealDetailsModal
```

If the repo does not have `common.close`, add it in Task 7 i18n as `"Close"` / `"Cerrar"`.

- [ ] **Step 3: Mount modal**

In `src/features/calendar/components/CalendarPage.tsx`, import and render:

```tsx
import MealDetailsModal from "@/features/meals/components/MealDetailsModal"
```

```tsx
<MealDetailsModal />
```

- [ ] **Step 4: Verify**

Run:

```bash
bun run typecheck
bun run check
```

Expected: both commands pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/meals/stores/mealDetailsModal.store.ts src/features/meals/components/MealDetailsModal.tsx src/features/calendar/components/CalendarPage.tsx
git commit -m "feat(meals): add meal details modal"
```

---

### Task 6: Add Separate Meal Planner Page

**Files:**
- Create: `src/features/meals/components/MealsPage.tsx`
- Create: `src/features/meals/components/MealPlanModal.tsx`
- Create: `src/features/meals/stores/mealPlanModal.store.ts`
- Create: `src/routes/_authenticated/meals.tsx`

- [ ] **Step 1: Add planner modal store**

Create `src/features/meals/stores/mealPlanModal.store.ts`:

```ts
import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

import type { MealPlan } from "../types"

interface MealPlanModalState {
	isOpen: boolean
	mealPlan: MealPlan | null
}

export const mealPlanModalAtom = atom<MealPlanModalState>({
	isOpen: false,
	mealPlan: null,
})

export const openMealPlanModal = (mealPlan: MealPlan | null = null) => {
	appStore.set(mealPlanModalAtom, {
		isOpen: true,
		mealPlan,
	})
}

export const closeMealPlanModal = () => {
	appStore.set(mealPlanModalAtom, {
		isOpen: false,
		mealPlan: null,
	})
}
```

- [ ] **Step 2: Add create/edit modal**

Create `src/features/meals/components/MealPlanModal.tsx` using `react-hook-form` and `zod` only if validation complexity grows. For MVP, use local controlled fields:

```tsx
import { Button, Dialog, Input, Label, Select, TextArea } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { MEAL_TYPE_OPTIONS } from "../constants"
import { useCreateMealPlan, useUpdateMealPlan } from "../hooks/useMeals"
import { closeMealPlanModal, mealPlanModalAtom } from "../stores/mealPlanModal.store"

import type { MealType } from "../types"

const todayDate = () => new Date().toISOString().slice(0, 10)

const MealPlanModal = () => {
	const { t } = useTranslation()
	const { isOpen, mealPlan } = useAtomValue(mealPlanModalAtom)
	const createMealPlanMutation = useCreateMealPlan()
	const updateMealPlanMutation = useUpdateMealPlan()
	const [date, setDate] = useState(mealPlan?.date ?? todayDate())
	const [mealType, setMealType] = useState<MealType>(mealPlan?.mealType ?? "lunch")
	const [title, setTitle] = useState(mealPlan?.title ?? "")
	const [items, setItems] = useState(mealPlan?.items.join(", ") ?? "")
	const [allergens, setAllergens] = useState(mealPlan?.allergens.join(", ") ?? "")
	const [servedTime, setServedTime] = useState(mealPlan?.servedAt.slice(11, 16) ?? "11:30")
	const [notes, setNotes] = useState(mealPlan?.notes ?? "")

	const handleSubmit = () => {
		const payload = {
			date,
			mealType,
			title,
			items: items
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean),
			allergens: allergens
				.split(",")
				.map((allergen) => allergen.trim())
				.filter(Boolean),
			roomIds: mealPlan?.roomIds ?? [],
			notes: notes.trim() || undefined,
			servedAt: `${date}T${servedTime}:00`,
		}

		if (mealPlan) {
			updateMealPlanMutation.mutate(
				{ mealPlanId: mealPlan.id, payload },
				{
					onSuccess: closeMealPlanModal,
				},
			)
			return
		}

		createMealPlanMutation.mutate(payload, {
			onSuccess: closeMealPlanModal,
		})
	}

	return (
		<Dialog isOpen={isOpen} onOpenChange={(open) => !open && closeMealPlanModal()}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>{mealPlan ? t("meals.modal.editTitle") : t("meals.modal.createTitle")}</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body className="space-y-4">
					<div className="grid gap-2">
						<Label>{t("meals.fields.date")}</Label>
						<Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
					</div>
					<div className="grid gap-2">
						<Label>{t("meals.fields.type")}</Label>
						<Select selectedKey={mealType} onSelectionChange={(key) => setMealType(key as MealType)}>
							<Select.Trigger>
								<Select.Value />
							</Select.Trigger>
							<Select.Popover>
								<Select.Listbox>
									{MEAL_TYPE_OPTIONS.map((option) => (
										<Select.Option key={option.key} id={option.key}>
											{t(option.labelKey)}
										</Select.Option>
									))}
								</Select.Listbox>
							</Select.Popover>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label>{t("meals.fields.title")}</Label>
						<Input value={title} onChange={(event) => setTitle(event.target.value)} />
					</div>
					<div className="grid gap-2">
						<Label>{t("meals.fields.servedTime")}</Label>
						<Input type="time" value={servedTime} onChange={(event) => setServedTime(event.target.value)} />
					</div>
					<div className="grid gap-2">
						<Label>{t("meals.fields.items")}</Label>
						<Input value={items} onChange={(event) => setItems(event.target.value)} />
					</div>
					<div className="grid gap-2">
						<Label>{t("meals.fields.allergens")}</Label>
						<Input value={allergens} onChange={(event) => setAllergens(event.target.value)} />
					</div>
					<div className="grid gap-2">
						<Label>{t("meals.fields.notes")}</Label>
						<TextArea value={notes} onChange={(event) => setNotes(event.target.value)} />
					</div>
				</Dialog.Body>
				<Dialog.Footer>
					<Button variant="secondary" onPress={closeMealPlanModal}>
						{t("common.cancel")}
					</Button>
					<Button variant="primary" onPress={handleSubmit}>
						{t("common.save")}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog>
	)
}

export default MealPlanModal
```

- [ ] **Step 3: Add meals page**

Create `src/features/meals/components/MealsPage.tsx`:

```tsx
import { Button, Card, Chip } from "@heroui/react"
import { useTranslation } from "react-i18next"

import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"

import { useMealPlans } from "../hooks/useMeals"
import { openMealPlanModal } from "../stores/mealPlanModal.store"

import MealPlanModal from "./MealPlanModal"

const getCurrentWeekRange = () => {
	const today = new Date()
	const start = new Date(today)
	start.setDate(today.getDate() - today.getDay())
	start.setHours(0, 0, 0, 0)
	const end = new Date(start)
	end.setDate(start.getDate() + 7)

	return {
		start: start.toISOString().slice(0, 10),
		end: end.toISOString().slice(0, 10),
	}
}

const MealsPage = () => {
	const { t } = useTranslation()
	const range = getCurrentWeekRange()
	const { data: mealPlans = [] } = useMealPlans(range)

	return (
		<main className="container mx-auto max-w-7xl px-6 py-5">
			<div className="mb-6 flex items-start justify-between gap-4">
				<div className="grid gap-1">
					<h1 className="font-semibold text-3xl text-foreground">{t("meals.title")}</h1>
					<p className="text-default-500 text-sm">{t("meals.description")}</p>
				</div>
				<Button variant="primary" onPress={() => openMealPlanModal()}>
					<OcticonFeedPlus16 aria-hidden className="size-4" />
					{t("meals.actions.add")}
				</Button>
			</div>
			<div className="grid gap-3">
				{mealPlans.map((mealPlan) => (
					<Card key={mealPlan.id} className="p-4">
						<div className="flex items-start justify-between gap-4">
							<div className="grid gap-2">
								<div>
									<p className="font-semibold text-foreground">{mealPlan.title}</p>
									<p className="text-default-500 text-sm">
										{mealPlan.date} · {t(`meals.types.${mealPlan.mealType}`)} · {mealPlan.servedAt.slice(11, 16)}
									</p>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{mealPlan.items.map((item) => (
										<Chip key={item} size="sm" variant="soft">
											{item}
										</Chip>
									))}
								</div>
							</div>
							<Button size="sm" variant="secondary" onPress={() => openMealPlanModal(mealPlan)}>
								{t("common.edit")}
							</Button>
						</div>
					</Card>
				))}
			</div>
			<MealPlanModal />
		</main>
	)
}

export default MealsPage
```

- [ ] **Step 4: Add route**

Create `src/routes/_authenticated/meals.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router"

import MealsPage from "@/features/meals/components/MealsPage"

export const Route = createFileRoute("/_authenticated/meals")({
	component: MealsPage,
	beforeLoad: () => {
		return {
			breadcrumbKey: "meals.title",
		}
	},
})
```

- [ ] **Step 5: Verify**

Run:

```bash
bun run typecheck
bun run check
```

Expected: both commands pass. `src/routeTree.gen.ts` may regenerate through the router plugin during dev/build; do not edit it manually.

- [ ] **Step 6: Browser verify**

Run the dev server if needed:

```bash
bun run dev
```

Open:

```text
https://localhost:5173/meals
```

Verify:
- Page renders without console errors.
- Existing mock meal plans are listed.
- Add button opens `MealPlanModal`.
- Saving a new meal adds it to the list.

- [ ] **Step 7: Commit**

```bash
git add src/features/meals/components/MealsPage.tsx src/features/meals/components/MealPlanModal.tsx src/features/meals/stores/mealPlanModal.store.ts src/routes/_authenticated/meals.tsx
git commit -m "feat(meals): add meal planner page"
```

---

### Task 7: Add Internationalization And Navigation

**Files:**
- Modify: `src/i18n/locales/en.ts`
- Modify: `src/i18n/locales/es.ts`
- Modify: navigation data file found by `rg -n "calendar.title|Calendar|nav" src/components src/constants src/features -S`

- [ ] **Step 1: Add English keys**

In `src/i18n/locales/en.ts`, add:

```ts
meals: {
	title: "Meals",
	description: "Plan menus, allergens, and serving times.",
	types: {
		breakfast: "Breakfast",
		lunch: "Lunch",
		snack: "Snack",
	},
	actions: {
		add: "Add meal",
	},
	fields: {
		date: "Date",
		type: "Meal type",
		title: "Menu title",
		servedTime: "Serving time",
		items: "Items",
		allergens: "Allergens",
		notes: "Notes",
	},
	modal: {
		createTitle: "Add meal plan",
		editTitle: "Edit meal plan",
	},
	details: {
		title: "Meal details",
		noAllergens: "No allergens",
	},
},
```

Add `calendar.toolbar.showMeals: "Meals"` to the existing `calendar` keys.

If missing, add:

```ts
common: {
	cancel: "Cancel",
	close: "Close",
	edit: "Edit",
	save: "Save",
}
```

Preserve existing common keys if they already exist; merge these names into the existing object.

- [ ] **Step 2: Add Spanish keys**

In `src/i18n/locales/es.ts`, add:

```ts
meals: {
	title: "Comidas",
	description: "Planifica menús, alérgenos y horarios de servicio.",
	types: {
		breakfast: "Desayuno",
		lunch: "Almuerzo",
		snack: "Merienda",
	},
	actions: {
		add: "Agregar comida",
	},
	fields: {
		date: "Fecha",
		type: "Tipo de comida",
		title: "Título del menú",
		servedTime: "Hora de servicio",
		items: "Elementos",
		allergens: "Alérgenos",
		notes: "Notas",
	},
	modal: {
		createTitle: "Agregar plan de comida",
		editTitle: "Editar plan de comida",
	},
	details: {
		title: "Detalles de comida",
		noAllergens: "Sin alérgenos",
	},
},
```

Add `calendar.toolbar.showMeals: "Comidas"` to the existing `calendar` keys.

If missing, add:

```ts
common: {
	cancel: "Cancelar",
	close: "Cerrar",
	edit: "Editar",
	save: "Guardar",
}
```

Preserve existing common keys if they already exist; merge these names into the existing object.

- [ ] **Step 3: Add navigation link**

Find the nav data file:

```bash
rg -n "calendar.title|Calendar|navDrawerData" src/components src/constants src/features -S
```

Add a `Meals` nav item under the same school group as Calendar:

```ts
{
	labelKey: "meals.title",
	href: "/meals",
	icon: MdiFoodApple,
}
```

Use an existing food icon import if present, such as:

```ts
import MdiFoodApple from "~icons/mdi/food-apple"
```

- [ ] **Step 4: Verify language switching**

Run:

```bash
bun run typecheck
bun run check
```

Open:

```text
https://localhost:5173/meals
https://localhost:5173/calendar
```

Verify:
- Meals page title/description/actions translate in EN and ES.
- Calendar `Meals` layer label translates in EN and ES.
- Meal titles/items/allergens from data are not translated because they may come from API.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/locales/en.ts src/i18n/locales/es.ts
git add path/to/navigation/file.ts
git commit -m "feat(i18n): add meal planner translations"
```

---

### Task 8: Final Verification

**Files:**
- No new files.

- [ ] **Step 1: Run full repository verification**

Run:

```bash
bun run typecheck
bun run check
```

Expected: both commands pass.

- [ ] **Step 2: Browser acceptance test**

Open:

```text
https://localhost:5173/meals
```

Verify:
- Meals page renders.
- Add meal opens the modal.
- Creating a meal adds it to the planner.
- Editing a meal updates the planner.

Open:

```text
https://localhost:5173/calendar
```

Verify:
- Calendar still renders event planner items.
- `Meals` toggle hides and shows meal layer.
- Meal items render with meal styling.
- Meal click opens meal detail modal.
- Normal event click opens event modal.
- Language change updates labels/actions but not mock/API meal data.

- [ ] **Step 3: Commit final cleanup if needed**

Only commit if Task 8 required fixes:

```bash
git add src/features/meals src/features/calendar src/routes/_authenticated src/i18n
git commit -m "fix(meals): complete meal planner integration"
```

---

## Self-Review

**Spec coverage:** The plan keeps meal planner and event planner as separate domains, adds a dedicated `/meals` planner, and exposes meals in calendar through an optional display layer.

**Placeholder scan:** No `TBD`, `TODO`, or unspecified implementation steps remain. Each task has exact file paths, code blocks, commands, and expected verification.

**Type consistency:** `MealPlan`, `MealType`, `GetMealPlansParams`, `CalendarEvent.displayKind`, and `sourceId` are introduced before they are consumed.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-09-meal-planner-calendar-layer.md`. Two execution options:

**1. Subagent-Driven (recommended)** - dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** - execute tasks in this session using executing-plans, batch execution with checkpoints.
