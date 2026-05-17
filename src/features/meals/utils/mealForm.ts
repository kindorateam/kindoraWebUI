import type { MealPlan, MealRepeatFrequency, MealType } from "../types"

export interface MealPlanFormState {
	date: string
	mealType: MealType
	title: string
	servedTime: string
	items: string
	allergens: string
	notes: string
	repeatFrequency: MealRepeatFrequency
	repeatUntil: string
}

export const getTodayDate = () => new Date().toISOString().slice(0, 10)

export const getMealPlanFormState = (mealPlan?: MealPlan | null): MealPlanFormState => ({
	date: mealPlan?.date ?? getTodayDate(),
	mealType: mealPlan?.mealType ?? "lunch",
	title: mealPlan?.title ?? "",
	servedTime: mealPlan?.servedAt.slice(11, 16) ?? "11:30",
	items: mealPlan?.items.join(", ") ?? "",
	allergens: mealPlan?.allergens.join(", ") ?? "",
	notes: mealPlan?.notes ?? "",
	repeatFrequency: mealPlan?.repeatFrequency ?? "none",
	repeatUntil: mealPlan?.repeatUntil ?? "",
})

export const splitMealFormList = (value: string) =>
	value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean)
