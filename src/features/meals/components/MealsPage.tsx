import { Button } from "@heroui/react"
import { useTranslation } from "react-i18next"

import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"

import { useMealPlans } from "../hooks/useMeals"
import { openMealPlanModal } from "../stores/mealPlanModal.store"

import MealPlanCard from "./MealPlanCard"
import MealPlanModal from "./MealPlanModal"

const getCurrentWeekRange = () => {
	const today = new Date()
	const start = new Date(today)
	start.setDate(today.getDate() - today.getDay())
	start.setHours(0, 0, 0, 0)
	const end = new Date(start)
	end.setDate(start.getDate() + 7)

	return {
		start: start.toISOString().slice(0, 10),
		end: end.toISOString().slice(0, 10),
	}
}

const MealsPage = () => {
	const { t } = useTranslation()
	const range = getCurrentWeekRange()
	const { data: mealPlans = [] } = useMealPlans(range)

	return (
		<main className="container mx-auto max-w-7xl px-6 py-5">
			<div className="mb-6 flex items-start justify-between gap-4">
				<div className="grid gap-1">
					<h1 className="font-semibold text-3xl text-foreground">{t("meals.title")}</h1>
					<p className="text-default-500 text-sm">{t("meals.description")}</p>
				</div>
				<Button variant="primary" onPress={() => openMealPlanModal()}>
					<OcticonFeedPlus16 aria-hidden className="size-4" />
					{t("meals.actions.add")}
				</Button>
			</div>

			<div className="grid gap-3">
				{mealPlans.map((mealPlan) => (
					<MealPlanCard key={mealPlan.id} mealPlan={mealPlan} />
				))}
			</div>
			<MealPlanModal />
		</main>
	)
}

export default MealsPage
