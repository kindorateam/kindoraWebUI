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

let mockMealPlans: MealPlan[] = createMockMealPlans()

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

	mockMealPlans = sortMealPlans(
		mockMealPlans.map((mealPlan, index) => (index === mealPlanIndex ? updatedMealPlan : mealPlan)),
	)

	return updatedMealPlan
}

export const deleteMealPlan = async (mealPlanId: string): Promise<void> => {
	mockMealPlans = mockMealPlans.filter((mealPlan) => mealPlan.id !== mealPlanId)
}
