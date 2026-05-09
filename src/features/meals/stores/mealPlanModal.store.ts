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
