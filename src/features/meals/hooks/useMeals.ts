import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { QUERY_DEFAULTS } from "@/services/query.constants"

import { createMealPlan, deleteMealPlan, getMealPlans, updateMealPlan } from "../services/meal.service"

import type { CreateMealPlanPayload, GetMealPlansParams, UpdateMealPlanPayload } from "../types"

export const useMealPlans = (params: GetMealPlansParams, enabled = true) => {
	return useQuery({
		queryKey: ["meal-plans", params.start, params.end],
		queryFn: () => getMealPlans(params),
		...QUERY_DEFAULTS,
		enabled: enabled && !!params.start && !!params.end,
	})
}

export const useCreateMealPlan = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateMealPlanPayload) => createMealPlan(payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["meal-plans"] })
		},
	})
}

export const useUpdateMealPlan = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ mealPlanId, payload }: { mealPlanId: string; payload: UpdateMealPlanPayload }) =>
			updateMealPlan(mealPlanId, payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["meal-plans"] })
		},
	})
}

export const useDeleteMealPlan = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (mealPlanId: string) => deleteMealPlan(mealPlanId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["meal-plans"] })
		},
	})
}
