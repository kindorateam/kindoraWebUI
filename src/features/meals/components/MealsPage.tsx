import { Button } from "@heroui/react"
import { useTranslation } from "react-i18next"

import TableError from "@/components/TableError"
import MdiFoodApple from "~icons/mdi/food-apple"
import PhCalendarBlank from "~icons/ph/calendar-blank"
import PhPlusBold from "~icons/ph/plus-bold"
import PhRepeat from "~icons/ph/repeat"

import { useMealPlans } from "../hooks/useMeals"
import { openMealPlanModal } from "../stores/mealPlanModal.store"

import MealDaySection from "./MealDaySection"
import MealPlanModal from "./MealPlanModal"
import MealsEmptyState from "./MealsEmptyState"
import MealsScheduleSkeleton from "./MealsScheduleSkeleton"

import type { MealPlan } from "../types"

const toLocalDateString = (date: Date): string =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

const getCurrentWeekRange = () => {
	const today = new Date()
	const startDate = new Date(today)
	startDate.setDate(today.getDate() - today.getDay())
	startDate.setHours(0, 0, 0, 0)
	const endDate = new Date(startDate)
	endDate.setDate(startDate.getDate() + 7)
	const displayEndDate = new Date(startDate)
	displayEndDate.setDate(startDate.getDate() + 6)

	return {
		start: toLocalDateString(startDate),
		end: toLocalDateString(endDate),
		startDate,
		displayEndDate,
	}
}

const groupMealPlansByDate = (mealPlans: MealPlan[]): Array<[string, MealPlan[]]> => {
	const groups = new Map<string, MealPlan[]>()

	for (const mealPlan of mealPlans) {
		const group = groups.get(mealPlan.date)
		if (group) {
			group.push(mealPlan)
		} else {
			groups.set(mealPlan.date, [mealPlan])
		}
	}

	return [...groups.entries()]
}

const MealsPage = () => {
	const { t, i18n } = useTranslation()
	const range = getCurrentWeekRange()
	const { data: mealPlans = [], isLoading, error, refetch } = useMealPlans(range)
	const groupedMealPlans = groupMealPlansByDate(mealPlans)
	const repeatingMealCount = mealPlans.filter((mealPlan) => mealPlan.repeatFrequency !== "none").length
	const dateFormatter = new Intl.DateTimeFormat(i18n.language, { day: "numeric", month: "short" })
	const weekLabel = `${dateFormatter.format(range.startDate)} – ${dateFormatter.format(range.displayEndDate)}`

	return (
		<main className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
			<header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="mb-2 flex items-center gap-2 font-semibold text-primary text-xs uppercase tracking-[0.14em]">
						<MdiFoodApple aria-hidden className="size-4" />
						{t("meals.schedule.weeklyMenu")}
					</p>
					<h1 className="text-balance font-semibold text-4xl text-foreground leading-none tracking-[-0.04em]">
						{t("meals.title")}
					</h1>
					<p className="mt-3 max-w-xl text-default-500 text-sm leading-6">{t("meals.description")}</p>
				</div>
				<Button className="self-start sm:self-auto" size="lg" variant="primary" onPress={() => openMealPlanModal()}>
					<PhPlusBold aria-hidden className="size-4" />
					{t("meals.actions.add")}
				</Button>
			</header>

			<section
				aria-label={t("meals.schedule.ariaLabel")}
				className="overflow-hidden rounded-[28px] border border-default-200 bg-default-50/70"
			>
				<div className="flex flex-col gap-4 border-default-200 border-b bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-[13px] bg-primary-50 text-primary ring-1 ring-primary-100">
							<PhCalendarBlank aria-hidden className="size-5" />
						</div>
						<div>
							<p className="font-semibold text-foreground text-sm">
								{t("meals.schedule.weekOf", { range: weekLabel })}
							</p>
							<p className="mt-0.5 text-default-500 text-xs">
								{t("meals.schedule.mealsPlanned", { count: mealPlans.length })}
							</p>
						</div>
					</div>

					{repeatingMealCount > 0 && (
						<div className="flex items-center gap-2 text-default-500 text-xs">
							<PhRepeat aria-hidden className="size-4" />
							{t("meals.schedule.repeatingMeals", { count: repeatingMealCount })}
						</div>
					)}
				</div>

				{isLoading ? (
					<MealsScheduleSkeleton />
				) : error ? (
					<TableError onRetry={() => void refetch()} />
				) : groupedMealPlans.length === 0 ? (
					<MealsEmptyState />
				) : (
					<div className="p-4 sm:p-6">
						{groupedMealPlans.map(([date, plans]) => (
							<MealDaySection date={date} key={date} mealPlans={plans} />
						))}
					</div>
				)}
			</section>

			<MealPlanModal />
		</main>
	)
}

export default MealsPage
