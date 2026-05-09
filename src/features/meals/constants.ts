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
