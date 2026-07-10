import { createMealPlan, deleteMealPlan, getMealPlans } from "./meal.service"

import type { CreateMealPlanPayload, MealRepeatDay, MealRepeatFrequency } from "../types"

import { describe, expect, test } from "bun:test"

const createRepeatingMeal = (
	title: string,
	repeatFrequency: MealRepeatFrequency,
	repeatDays?: MealRepeatDay[],
): CreateMealPlanPayload => ({
	allergens: [],
	date: "2026-07-05",
	items: [title],
	mealType: "lunch",
	notes: undefined,
	repeatDays,
	repeatFrequency,
	roomIds: [],
	servedAt: "2026-07-05T11:30:00",
	title,
})

const getOccurrenceDates = async (title: string, end = "2026-07-12") => {
	const plans = await getMealPlans({ start: "2026-07-05", end })
	return plans.filter((plan) => plan.title === title).map((plan) => plan.date)
}

describe("meal recurrence", () => {
	test("expands weekday meals from Monday through Friday", async () => {
		const meal = await createMealPlan(createRepeatingMeal("Weekday recurrence test", "weekdays"))

		try {
			expect(await getOccurrenceDates(meal.title)).toEqual([
				"2026-07-06",
				"2026-07-07",
				"2026-07-08",
				"2026-07-09",
				"2026-07-10",
			])
		} finally {
			await deleteMealPlan(meal.id)
		}
	})

	test("expands custom meals only on selected days", async () => {
		const meal = await createMealPlan(createRepeatingMeal("Custom recurrence test", "custom", [1, 3, 5]))

		try {
			expect(await getOccurrenceDates(meal.title)).toEqual(["2026-07-06", "2026-07-08", "2026-07-10"])
		} finally {
			await deleteMealPlan(meal.id)
		}
	})

	test("keeps weekly meals on the starting weekday", async () => {
		const meal = await createMealPlan({
			...createRepeatingMeal("Weekly recurrence test", "weekly"),
			date: "2026-07-06",
			servedAt: "2026-07-06T11:30:00",
		})

		try {
			expect(await getOccurrenceDates(meal.title, "2026-07-20")).toEqual(["2026-07-06", "2026-07-13"])
		} finally {
			await deleteMealPlan(meal.id)
		}
	})
})
