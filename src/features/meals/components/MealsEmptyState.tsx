import { Button, EmptyState } from "@heroui/react"
import { useTranslation } from "react-i18next"

import PhBowlFoodDuotone from "~icons/ph/bowl-food-duotone"
import PhPlusBold from "~icons/ph/plus-bold"

import { openMealPlanModal } from "../stores/mealPlanModal.store"

const MealsEmptyState = () => {
	const { t } = useTranslation()

	return (
		<EmptyState className="flex min-h-96 flex-col items-center justify-center px-6 py-14 text-center">
			<div className="flex size-16 items-center justify-center rounded-[20px] bg-primary-50 text-primary ring-1 ring-primary-100">
				<PhBowlFoodDuotone aria-hidden className="size-9" />
			</div>
			<h2 className="mt-5 font-semibold text-2xl text-foreground tracking-[-0.02em]">{t("meals.empty.title")}</h2>
			<p className="mt-2 max-w-md text-default-500 text-sm leading-6">{t("meals.empty.description")}</p>
			<Button className="mt-6" variant="primary" onPress={() => openMealPlanModal()}>
				<PhPlusBold aria-hidden className="size-4" />
				{t("meals.actions.add")}
			</Button>
		</EmptyState>
	)
}

export default MealsEmptyState
