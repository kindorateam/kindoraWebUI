import { Button, Card, Chip } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { openMealPlanModal } from "../stores/mealPlanModal.store"

import type { MealPlan } from "../types"

interface MealPlanCardProps {
	mealPlan: MealPlan
}

const MealPlanCard = ({ mealPlan }: MealPlanCardProps) => {
	const { t, i18n } = useTranslation()
	const servedAt = new Date(mealPlan.servedAt).toLocaleString(i18n.language, {
		dateStyle: "medium",
		timeStyle: "short",
	})

	return (
		<Card className="p-4">
			<div className="flex items-start justify-between gap-4">
				<div className="grid gap-2">
					<div>
						<p className="font-semibold text-foreground">{mealPlan.title}</p>
						<p className="text-default-500 text-sm">
							{servedAt} · <span className="capitalize">{mealPlan.mealType}</span>
							{mealPlan.repeatFrequency === "weekly" ? ` · ${t("meals.repeat.weekly")}` : ""}
						</p>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{mealPlan.items.map((item) => (
							<Chip key={item} size="sm" variant="soft">
								{item}
							</Chip>
						))}
					</div>
				</div>
				<Button size="sm" variant="secondary" onPress={() => openMealPlanModal(mealPlan)}>
					{t("common.edit")}
				</Button>
			</div>
		</Card>
	)
}

export default MealPlanCard
