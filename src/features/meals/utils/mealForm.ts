import type { MealPlan, MealRepeatDay, MealRepeatFrequency, MealType } from "../types"

export type MealAudience = "all" | "selected"

export interface MealPlanFormState {
	date: string
	mealType: MealType
	title: string
	servedTime: string
	items: string[]
	allergens: string[]
	audience: MealAudience
	roomIds: string[]
	notes: string
	repeatFrequency: MealRepeatFrequency
	repeatDays: MealRepeatDay[]
	repeatUntil: string
}

export const getTodayDate = () => new Date().toISOString().slice(0, 10)

export const getMealPlanFormState = (mealPlan?: MealPlan | null): MealPlanFormState => ({
	date: mealPlan?.date ?? getTodayDate(),
	mealType: mealPlan?.mealType ?? "lunch",
	title: mealPlan?.title ?? "",
	servedTime: mealPlan?.servedAt.slice(11, 16) ?? "11:30",
	items: mealPlan?.items ?? [],
	allergens: mealPlan?.allergens ?? [],
	audience: mealPlan && mealPlan.roomIds.length > 0 ? "selected" : "all",
	roomIds: mealPlan?.roomIds ?? [],
	notes: mealPlan?.notes ?? "",
	repeatFrequency: mealPlan?.repeatFrequency ?? "none",
	repeatDays: mealPlan?.repeatDays ?? [],
	repeatUntil: mealPlan?.repeatUntil ?? "",
})
