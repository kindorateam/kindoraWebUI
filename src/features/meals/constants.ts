import type { MealRepeatFrequency, MealType } from "./types"

export const MEAL_TYPE_OPTIONS: { key: MealType; labelKey: string }[] = [
	{ key: "breakfast", labelKey: "meals.types.breakfast" },
	{ key: "lunch", labelKey: "meals.types.lunch" },
	{ key: "snack", labelKey: "meals.types.snack" },
]

export const MEAL_REPEAT_OPTIONS: { key: MealRepeatFrequency; labelKey: string }[] = [
	{ key: "none", labelKey: "meals.repeat.none" },
	{ key: "weekly", labelKey: "meals.repeat.weekly" },
	{ key: "weekdays", labelKey: "meals.repeat.weekdays" },
	{ key: "custom", labelKey: "meals.repeat.custom" },
]

export const MEAL_REPEAT_SUMMARY_KEYS: Record<MealRepeatFrequency, string> = {
	none: "meals.repeat.none",
	weekly: "meals.repeat.weeklyShort",
	weekdays: "meals.repeat.weekdaysShort",
	custom: "meals.repeat.customShort",
}

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
