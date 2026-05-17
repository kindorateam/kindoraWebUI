import { Button, Input, Label, ListBox, Modal, Select, TextArea, TextField, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"

import { MEAL_TYPE_OPTIONS } from "../constants"
import { useCreateMealPlan, useUpdateMealPlan } from "../hooks/useMeals"
import { closeMealPlanModal, mealPlanModalAtom } from "../stores/mealPlanModal.store"
import { getMealPlanFormState, splitMealFormList } from "../utils/mealForm"

import MealRepeatFields from "./MealRepeatFields"

import type { MealType } from "../types"
import type { MealPlanFormState } from "../utils/mealForm"

const MealPlanModal = () => {
	const { t } = useTranslation()
	const { isOpen, mealPlan } = useAtomValue(mealPlanModalAtom)
	const createMealPlanMutation = useCreateMealPlan()
	const updateMealPlanMutation = useUpdateMealPlan()
	const [formData, setFormData] = useState<MealPlanFormState>(getMealPlanFormState())

	useEffect(() => {
		if (!isOpen) return

		setFormData(getMealPlanFormState(mealPlan))
	}, [isOpen, mealPlan])

	const updateField = <K extends keyof MealPlanFormState>(field: K, value: MealPlanFormState[K]) => {
		setFormData((prev) => {
			if (field === "repeatFrequency" && value === "none") {
				return { ...prev, repeatFrequency: "none", repeatUntil: "" }
			}

			return { ...prev, [field]: value }
		})
	}

	const handleSubmit = () => {
		if (!formData.title.trim()) return

		const payload = {
			date: formData.date,
			mealType: formData.mealType,
			title: formData.title.trim(),
			items: splitMealFormList(formData.items),
			allergens: splitMealFormList(formData.allergens),
			roomIds: mealPlan?.roomIds ?? [],
			notes: formData.notes.trim() || undefined,
			repeatFrequency: formData.repeatFrequency,
			repeatUntil: formData.repeatFrequency === "weekly" ? formData.repeatUntil || undefined : undefined,
			servedAt: `${formData.date}T${formData.servedTime}:00`,
		}
		const onSuccess = () => {
			toast(mealPlan ? t("meals.toast.updated") : t("meals.toast.created"), { variant: "success" })
			closeMealPlanModal()
		}
		const onError = (error: Error) => {
			toast(mealPlan ? t("meals.toast.updateFailed") : t("meals.toast.createFailed"), {
				description: getErrorMessage(error),
				variant: "danger",
			})
		}

		if (mealPlan) {
			updateMealPlanMutation.mutate({ mealPlanId: mealPlan.id, payload }, { onSuccess, onError })
			return
		}

		createMealPlanMutation.mutate(payload, { onSuccess, onError })
	}

	const isLoading = createMealPlanMutation.isPending || updateMealPlanMutation.isPending

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && closeMealPlanModal()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>{mealPlan ? t("meals.modal.editTitle") : t("meals.modal.createTitle")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="gap-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<TextField isRequired variant="secondary">
								<Label>{t("meals.fields.date")}</Label>
								<Input
									type="date"
									value={formData.date}
									onChange={(event) => updateField("date", event.target.value)}
								/>
							</TextField>
							<TextField isRequired variant="secondary">
								<Label>{t("meals.fields.servedTime")}</Label>
								<Input
									type="time"
									value={formData.servedTime}
									onChange={(event) => updateField("servedTime", event.target.value)}
								/>
							</TextField>
						</div>

						<Select
							selectedKey={formData.mealType}
							variant="secondary"
							onSelectionChange={(key) => {
								if (key !== null) updateField("mealType", key as MealType)
							}}
						>
							<Label>{t("meals.fields.type")}</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{MEAL_TYPE_OPTIONS.map((option) => (
										<ListBox.Item id={option.key} key={option.key} textValue={t(option.labelKey)}>
											{t(option.labelKey)}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
						</Select>

						<TextField isRequired variant="secondary">
							<Label>{t("meals.fields.title")}</Label>
							<Input value={formData.title} onChange={(event) => updateField("title", event.target.value)} />
						</TextField>
						<TextField variant="secondary">
							<Label>{t("meals.fields.items")}</Label>
							<Input value={formData.items} onChange={(event) => updateField("items", event.target.value)} />
						</TextField>
						<TextField variant="secondary">
							<Label>{t("meals.fields.allergens")}</Label>
							<Input value={formData.allergens} onChange={(event) => updateField("allergens", event.target.value)} />
						</TextField>
						<TextField variant="secondary">
							<Label>{t("meals.fields.notes")}</Label>
							<TextArea value={formData.notes} onChange={(event) => updateField("notes", event.target.value)} />
						</TextField>

						<MealRepeatFields
							repeatFrequency={formData.repeatFrequency}
							repeatUntil={formData.repeatUntil}
							onRepeatFrequencyChange={(repeatFrequency) => updateField("repeatFrequency", repeatFrequency)}
							onRepeatUntilChange={(repeatUntil) => updateField("repeatUntil", repeatUntil)}
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onPress={closeMealPlanModal} isDisabled={isLoading}>
							{t("common.cancel")}
						</Button>
						<Button variant="primary" onPress={handleSubmit} isPending={isLoading} isDisabled={!formData.title.trim()}>
							{t("common.save")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default MealPlanModal
