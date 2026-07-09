import { Button, Chip, Label, Modal } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { closeMealDetailsModal, mealDetailsModalAtom } from "../stores/mealDetailsModal.store"

const MealDetailsModal = () => {
	const { t, i18n } = useTranslation()
	const { isOpen, mealPlan } = useAtomValue(mealDetailsModalAtom)

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && closeMealDetailsModal()}>
			<Modal.Container>
				<Modal.Dialog className="max-w-md">
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>{mealPlan?.title ?? t("meals.details.title")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="gap-4">
						{mealPlan && (
							<>
								<div className="grid gap-1">
									<Label className="text-default-500 text-xs">{t("meals.fields.type")}</Label>
									<p className="font-medium text-sm capitalize">{mealPlan.mealType}</p>
								</div>
								{mealPlan.repeatFrequency === "weekly" && (
									<div className="grid gap-1">
										<Label className="text-default-500 text-xs">{t("meals.fields.repeat")}</Label>
										<p className="font-medium text-sm">
											{mealPlan.repeatUntil
												? t("meals.repeat.weeklyUntil", {
														date: new Date(`${mealPlan.repeatUntil}T00:00:00`).toLocaleDateString(i18n.language),
													})
												: t("meals.repeat.weekly")}
										</p>
									</div>
								)}
								<div className="grid gap-1">
									<Label className="text-default-500 text-xs">{t("meals.fields.items")}</Label>
									<div className="flex flex-wrap gap-1.5">
										{mealPlan.items.map((item) => (
											<Chip key={item} size="sm" variant="soft">
												{item}
											</Chip>
										))}
									</div>
								</div>
								<div className="grid gap-1">
									<Label className="text-default-500 text-xs">{t("meals.fields.allergens")}</Label>
									<div className="flex flex-wrap gap-1.5">
										{mealPlan.allergens.length > 0 ? (
											mealPlan.allergens.map((allergen) => (
												<Chip color="danger" key={allergen} size="sm" variant="soft">
													{allergen}
												</Chip>
											))
										) : (
											<span className="text-default-500 text-sm">{t("meals.details.noAllergens")}</span>
										)}
									</div>
								</div>
								{mealPlan.notes && (
									<div className="grid gap-1">
										<Label className="text-default-500 text-xs">{t("meals.fields.notes")}</Label>
										<p className="text-sm">{mealPlan.notes}</p>
									</div>
								)}
							</>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onPress={closeMealDetailsModal}>
							{t("common.close")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default MealDetailsModal
