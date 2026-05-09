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
