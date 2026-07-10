import { Button, Chip } from "@heroui/react"
import { useTranslation } from "react-i18next"

import PhBowlFoodDuotone from "~icons/ph/bowl-food-duotone"
import PhCoffeeDuotone from "~icons/ph/coffee-duotone"
import PhCookieDuotone from "~icons/ph/cookie-duotone"
import PhPencilSimpleLine from "~icons/ph/pencil-simple-line"
import PhRepeat from "~icons/ph/repeat"
import TablerAlertTriangle from "~icons/tabler/alert-triangle"

import { MEAL_REPEAT_SUMMARY_KEYS } from "../constants"
import { openMealPlanModal } from "../stores/mealPlanModal.store"

import type { MealPlan, MealType } from "../types"

interface MealPlanCardProps {
	mealPlan: MealPlan
}

const MEAL_TYPE_PRESENTATION = {
	breakfast: {
		icon: PhCoffeeDuotone,
		iconClassName: "bg-amber-50 text-amber-700 ring-amber-200/70",
		labelClassName: "text-amber-700",
		labelKey: "meals.types.breakfast",
	},
	lunch: {
		icon: PhBowlFoodDuotone,
		iconClassName: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
		labelClassName: "text-emerald-700",
		labelKey: "meals.types.lunch",
	},
	snack: {
		icon: PhCookieDuotone,
		iconClassName: "bg-violet-50 text-violet-700 ring-violet-200/70",
		labelClassName: "text-violet-700",
		labelKey: "meals.types.snack",
	},
} as const satisfies Record<
	MealType,
	{ icon: React.ComponentType<{ className?: string }>; iconClassName: string; labelClassName: string; labelKey: string }
>

const MealPlanCard = ({ mealPlan }: MealPlanCardProps) => {
	const { t, i18n } = useTranslation()
	const presentation = MEAL_TYPE_PRESENTATION[mealPlan.mealType]
	const MealIcon = presentation.icon
	const servedTime = new Date(mealPlan.servedAt).toLocaleTimeString(i18n.language, {
		hour: "numeric",
		minute: "2-digit",
	})

	return (
		<article className="group rounded-2xl border border-default-200 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_8px_24px_rgba(24,24,27,0.04)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(24,24,27,0.05),0_14px_30px_rgba(24,24,27,0.08)] sm:p-5">
			<div className="flex items-start gap-3 sm:gap-4">
				<div
					className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] ring-1 ${presentation.iconClassName}`}
				>
					<MealIcon aria-hidden className="size-6" />
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span className={`font-semibold text-xs uppercase tracking-[0.12em] ${presentation.labelClassName}`}>
							{t(presentation.labelKey)}
						</span>
						<span aria-hidden className="size-1 rounded-full bg-default-300" />
						<time className="font-semibold text-default-600 text-sm tabular-nums" dateTime={mealPlan.servedAt}>
							{servedTime}
						</time>
						{mealPlan.repeatFrequency !== "none" && (
							<span className="inline-flex items-center gap-1 text-default-500 text-xs">
								<PhRepeat aria-hidden className="size-3.5" />
								{t(MEAL_REPEAT_SUMMARY_KEYS[mealPlan.repeatFrequency])}
							</span>
						)}
					</div>

					<h3 className="mt-1.5 text-balance font-semibold text-foreground text-lg leading-6 tracking-[-0.01em]">
						{mealPlan.title}
					</h3>

					{mealPlan.items.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-1.5">
							{mealPlan.items.map((item) => (
								<Chip className="bg-default-100 text-default-700" key={item} size="sm" variant="soft">
									{item}
								</Chip>
							))}
						</div>
					)}

					{mealPlan.allergens.length > 0 && (
						<p className="mt-3 flex items-start gap-1.5 text-danger-600 text-xs leading-5">
							<TablerAlertTriangle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
							{t("meals.schedule.containsAllergens", { allergens: mealPlan.allergens.join(", ") })}
						</p>
					)}
				</div>

				<Button
					aria-label={t("meals.actions.editAria", { title: mealPlan.title })}
					className="shrink-0 text-default-500 hover:text-primary"
					size="sm"
					variant="ghost"
					onPress={() => openMealPlanModal(mealPlan)}
				>
					<PhPencilSimpleLine aria-hidden className="size-4" />
					<span className="hidden sm:inline">{t("common.edit")}</span>
				</Button>
			</div>
		</article>
	)
}

export default MealPlanCard
