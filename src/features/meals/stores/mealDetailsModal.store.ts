import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

import type { MealPlan } from "../types"

interface MealDetailsModalState {
	isOpen: boolean
	mealPlan: MealPlan | null
}

export const mealDetailsModalAtom = atom<MealDetailsModalState>({
	isOpen: false,
	mealPlan: null,
})

export const openMealDetailsModal = (mealPlan: MealPlan) => {
	appStore.set(mealDetailsModalAtom, {
		isOpen: true,
		mealPlan,
	})
}

export const closeMealDetailsModal = () => {
	appStore.set(mealDetailsModalAtom, {
		isOpen: false,
		mealPlan: null,
	})
}
