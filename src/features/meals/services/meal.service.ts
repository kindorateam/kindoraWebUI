import type { CreateMealPlanPayload, GetMealPlansParams, MealPlan, UpdateMealPlanPayload } from "../types"

const toLocalDateString = (date: Date): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const toLocalDateTimeString = (date: Date, time: string): string => `${toLocalDateString(date)}T${time}:00`

const toDateTimeString = (date: string, time: string): string => `${date}T${time}:00`

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

const getBaseMealPlanId = (mealPlanId: string): string => mealPlanId.split(":")[0] ?? mealPlanId

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
			repeatFrequency: "weekly",
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
			repeatFrequency: "weekly",
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
			repeatFrequency: "none",
			servedAt: toLocalDateTimeString(addDays(today, 1), "15:00"),
		},
	]
}

const sortMealPlans = (mealPlans: MealPlan[]): MealPlan[] => {
	return [...mealPlans].sort(
		(left, right) => parseDateValue(left.servedAt).getTime() - parseDateValue(right.servedAt).getTime(),
	)
}

const overlapsRange = (mealPlan: MealPlan, range: GetMealPlansParams): boolean => {
	const servedAt = parseDateValue(mealPlan.servedAt)
	const rangeStart = parseDateValue(range.start)
	const rangeEnd = parseDateValue(range.end)

	return servedAt >= rangeStart && servedAt < rangeEnd
}

const getRepeatEndDate = (mealPlan: MealPlan, rangeEnd: Date): Date => {
	if (!mealPlan.repeatUntil) return rangeEnd

	const repeatEndDate = parseDateValue(mealPlan.repeatUntil)
	repeatEndDate.setHours(23, 59, 59, 999)

	return repeatEndDate < rangeEnd ? repeatEndDate : rangeEnd
}

const getFirstWeeklyOccurrenceDate = (mealPlan: MealPlan, rangeStart: Date): Date => {
	const startDate = parseDateValue(mealPlan.date)
	if (startDate >= rangeStart) return startDate

	const dayDiff = Math.floor((rangeStart.getTime() - startDate.getTime()) / 86_400_000)
	const weeksToSkip = Math.floor(dayDiff / 7)
	const candidate = addDays(startDate, weeksToSkip * 7)

	return candidate < rangeStart ? addDays(candidate, 7) : candidate
}

const createMealPlanOccurrence = (mealPlan: MealPlan, date: Date): MealPlan => {
	const occurrenceDate = toLocalDateString(date)
	const servedTime = mealPlan.servedAt.slice(11, 16)

	if (occurrenceDate === mealPlan.date) {
		return mealPlan
	}

	return {
		...mealPlan,
		id: `${mealPlan.id}:${occurrenceDate}`,
		baseMealPlanId: mealPlan.id,
		date: occurrenceDate,
		servedAt: toDateTimeString(occurrenceDate, servedTime),
	}
}

const expandMealPlanOccurrences = (mealPlan: MealPlan, range: GetMealPlansParams): MealPlan[] => {
	if (mealPlan.repeatFrequency === "none") {
		return overlapsRange(mealPlan, range) ? [mealPlan] : []
	}

	const rangeStart = parseDateValue(range.start)
	const rangeEnd = parseDateValue(range.end)
	const repeatEndDate = getRepeatEndDate(mealPlan, rangeEnd)
	const occurrences: MealPlan[] = []

	for (
		let occurrenceDate = getFirstWeeklyOccurrenceDate(mealPlan, rangeStart);
		occurrenceDate <= repeatEndDate;
		occurrenceDate = addDays(occurrenceDate, 7)
	) {
		const occurrence = createMealPlanOccurrence(mealPlan, occurrenceDate)

		if (overlapsRange(occurrence, range)) {
			occurrences.push(occurrence)
		}
	}

	return occurrences
}

let mockMealPlans: MealPlan[] = createMockMealPlans()

export const getMealPlans = async (params: GetMealPlansParams): Promise<MealPlan[]> => {
	return sortMealPlans(mockMealPlans.flatMap((mealPlan) => expandMealPlanOccurrences(mealPlan, params)))
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
	const baseMealPlanId = getBaseMealPlanId(mealPlanId)
	const mealPlanIndex = mockMealPlans.findIndex((mealPlan) => mealPlan.id === baseMealPlanId)

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

	mockMealPlans = sortMealPlans(
		mockMealPlans.map((mealPlan, index) => (index === mealPlanIndex ? updatedMealPlan : mealPlan)),
	)

	return updatedMealPlan
}

export const deleteMealPlan = async (mealPlanId: string): Promise<void> => {
	const baseMealPlanId = getBaseMealPlanId(mealPlanId)
	mockMealPlans = mockMealPlans.filter((mealPlan) => mealPlan.id !== baseMealPlanId)
}
