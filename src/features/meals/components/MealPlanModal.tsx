import { Button, Label, Modal, TextArea, TextField, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"
import PhBowlFoodDuotone from "~icons/ph/bowl-food-duotone"
import PhCalendarDotsDuotone from "~icons/ph/calendar-dots-duotone"
import PhNotePencilDuotone from "~icons/ph/note-pencil-duotone"
import PhShieldCheckDuotone from "~icons/ph/shield-check-duotone"

import { DEFAULT_MEAL_TIMES } from "../constants"
import { useCreateMealPlan, useUpdateMealPlan } from "../hooks/useMeals"
import { closeMealPlanModal, mealPlanModalAtom } from "../stores/mealPlanModal.store"
import { getMealPlanFormState } from "../utils/mealForm"

import MealAudienceFields from "./MealAudienceFields"
import MealDetailsFields from "./MealDetailsFields"
import MealRepeatFields from "./MealRepeatFields"
import MealTagField from "./MealTagField"

import type { MealRepeatDay, MealRepeatFrequency, MealType } from "../types"
import type { MealAudience, MealPlanFormState } from "../utils/mealForm"

interface FormSectionProps {
	title: string
	icon: React.ComponentType<{ className?: string }>
	children: React.ReactNode
}

const FormSection = ({ title, icon: Icon, children }: FormSectionProps) => (
	<section className="grid gap-4">
		<div className="flex items-center gap-2.5">
			<span className="flex size-8 items-center justify-center rounded-[10px] bg-primary-50 text-primary">
				<Icon aria-hidden className="size-[18px]" />
			</span>
			<h3 className="font-semibold text-foreground text-sm tracking-[-0.01em]">{title}</h3>
		</div>
		{children}
	</section>
)

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
		setFormData((previous) => ({ ...previous, [field]: value }))
	}

	const handleMealTypeChange = (mealType: MealType) => {
		setFormData((previous) => ({
			...previous,
			mealType,
			servedTime:
				previous.servedTime === DEFAULT_MEAL_TIMES[previous.mealType]
					? DEFAULT_MEAL_TIMES[mealType]
					: previous.servedTime,
		}))
	}

	const handleAudienceChange = (audience: MealAudience) => {
		setFormData((previous) => ({
			...previous,
			audience,
			roomIds: audience === "all" ? [] : previous.roomIds,
		}))
	}

	const handleRepeatFrequencyChange = (repeatFrequency: MealRepeatFrequency) => {
		setFormData((previous) => {
			const selectedDateDay = new Date(`${previous.date}T12:00:00`).getDay() as MealRepeatDay
			return {
				...previous,
				repeatFrequency,
				repeatDays:
					repeatFrequency === "custom" && previous.repeatDays.length === 0 ? [selectedDateDay] : previous.repeatDays,
				repeatUntil: repeatFrequency === "none" ? "" : previous.repeatUntil,
			}
		})
	}

	const isFormValid =
		formData.title.trim().length > 0 &&
		formData.items.length > 0 &&
		(formData.audience === "all" || formData.roomIds.length > 0) &&
		(formData.repeatFrequency !== "custom" || formData.repeatDays.length > 0)

	const handleSubmit = () => {
		if (!isFormValid) return

		const payload = {
			date: formData.date,
			mealType: formData.mealType,
			title: formData.title.trim(),
			items: formData.items,
			allergens: formData.allergens,
			roomIds: formData.audience === "all" ? [] : formData.roomIds,
			notes: formData.notes.trim() || undefined,
			repeatFrequency: formData.repeatFrequency,
			repeatDays: formData.repeatFrequency === "custom" ? formData.repeatDays : undefined,
			repeatUntil: formData.repeatFrequency !== "none" ? formData.repeatUntil || undefined : undefined,
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
				<Modal.Dialog className="max-w-xl">
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>{mealPlan ? t("meals.modal.editTitle") : t("meals.modal.createTitle")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="-mx-1 flex max-h-[min(72dvh,44rem)] flex-col gap-8 overflow-y-auto px-1 py-2">
						<FormSection icon={PhBowlFoodDuotone} title={t("meals.sections.details")}>
							<MealDetailsFields
								formData={formData}
								onFieldChange={updateField}
								onMealTypeChange={handleMealTypeChange}
							/>
						</FormSection>

						<FormSection icon={PhShieldCheckDuotone} title={t("meals.sections.serving")}>
							<MealTagField
								helperText={t("meals.helpers.allergens")}
								id="meal-allergens"
								label={t("meals.fields.allergens")}
								placeholder={t("meals.placeholders.allergens")}
								values={formData.allergens}
								onChange={(allergens) => updateField("allergens", allergens)}
							/>
							<MealAudienceFields
								audience={formData.audience}
								roomIds={formData.roomIds}
								onAudienceChange={handleAudienceChange}
								onRoomIdsChange={(roomIds) => updateField("roomIds", roomIds)}
							/>
						</FormSection>

						<FormSection icon={PhCalendarDotsDuotone} title={t("meals.sections.schedule")}>
							<MealRepeatFields
								date={formData.date}
								repeatDays={formData.repeatDays}
								repeatFrequency={formData.repeatFrequency}
								repeatUntil={formData.repeatUntil}
								onRepeatDaysChange={(repeatDays) => updateField("repeatDays", repeatDays)}
								onRepeatFrequencyChange={handleRepeatFrequencyChange}
								onRepeatUntilChange={(repeatUntil) => updateField("repeatUntil", repeatUntil)}
							/>
						</FormSection>

						<FormSection icon={PhNotePencilDuotone} title={t("meals.sections.additional")}>
							<TextField variant="secondary">
								<Label>{t("meals.fields.notes")}</Label>
								<TextArea
									className="min-h-22"
									placeholder={t("meals.placeholders.notes")}
									value={formData.notes}
									variant="secondary"
									onChange={(event) => updateField("notes", event.target.value)}
								/>
							</TextField>
						</FormSection>
					</Modal.Body>
					<Modal.Footer className="pt-1">
						<Button variant="secondary" onPress={closeMealPlanModal} isDisabled={isLoading}>
							{t("common.cancel")}
						</Button>
						<Button variant="primary" onPress={handleSubmit} isPending={isLoading} isDisabled={!isFormValid}>
							{t("common.save")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default MealPlanModal
