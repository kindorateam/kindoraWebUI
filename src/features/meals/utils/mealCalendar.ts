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
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00`
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
