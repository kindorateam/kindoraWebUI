import { Chip } from "@heroui/react"
import { useTranslation } from "react-i18next"

import MealPlanCard from "./MealPlanCard"

import type { MealPlan } from "../types"

interface MealDaySectionProps {
	date: string
	mealPlans: MealPlan[]
}

const toLocalDateString = (date: Date): string =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

const MealDaySection = ({ date, mealPlans }: MealDaySectionProps) => {
	const { t, i18n } = useTranslation()
	const day = new Date(`${date}T12:00:00`)
	const isToday = date === toLocalDateString(new Date())
	const weekday = day.toLocaleDateString(i18n.language, { weekday: "long" })
	const calendarDate = day.toLocaleDateString(i18n.language, { day: "numeric", month: "short" })

	return (
		<section className="grid gap-4 border-default-200 border-t py-5 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6 md:py-6">
			<header className="flex items-center gap-3 md:block">
				<div>
					<p className="font-semibold text-default-500 text-xs uppercase tracking-[0.14em]">{calendarDate}</p>
					<h2 className="mt-1 font-semibold text-foreground text-lg capitalize tracking-[-0.01em]">{weekday}</h2>
				</div>
				{isToday && (
					<Chip className="md:mt-2" color="accent" size="sm" variant="soft">
						{t("meals.schedule.today")}
					</Chip>
				)}
			</header>

			<div className="grid gap-3">
				{mealPlans.map((mealPlan) => (
					<MealPlanCard key={mealPlan.id} mealPlan={mealPlan} />
				))}
			</div>
		</section>
	)
}

export default MealDaySection
