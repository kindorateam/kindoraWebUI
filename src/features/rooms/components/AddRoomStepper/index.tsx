import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import Stepper from "@/components/Stepper"

import { createAddRoomSchema } from "../../schemas/addRoom.schema"

import AddStaffStudentsStep from "./AddStaffStudentsStep"
import ConfirmRoomStep from "./ConfirmRoomStep"
import RoomDetailsStep from "./RoomDetailsStep"

import type { AddRoomFormData } from "../../types"

const STEP1_FIELDS = ["name", "capacity", "ratio", "minAge", "maxAge"] as const
const STEP2_FIELDS = ["staffIds", "studentIds"] as const

interface AddRoomStepperProps {
	onComplete?: (data: AddRoomFormData) => void
	onCancel?: () => void
	isLoading?: boolean
}

const AddRoomStepper = ({ onComplete, onCancel, isLoading = false }: AddRoomStepperProps) => {
	const { t } = useTranslation()
	const [currentStep, setCurrentStep] = useState(0)
	const steps = [
		{
			key: "details",
			label: t("rooms.addRoom.stepLabel", { current: 1, total: 3 }),
			content: <RoomDetailsStep />,
		},
		{
			key: "staff-students",
			label: t("rooms.addRoom.stepLabel", { current: 2, total: 3 }),
			content: <AddStaffStudentsStep />,
		},
		{
			key: "confirm",
			label: t("rooms.addRoom.stepLabel", { current: 3, total: 3 }),
			content: <ConfirmRoomStep />,
		},
	]

	const form = useForm<AddRoomFormData>({
		resolver: zodResolver(createAddRoomSchema(t)),
		defaultValues: {
			name: "",
			capacity: 1,
			ratio: 1,
			minAge: undefined,
			maxAge: undefined,
			staffIds: [],
			studentIds: [],
		},
		mode: "onChange",
	})

	const {
		watch,
		trigger,
		handleSubmit,
		formState: { errors },
	} = form
	const formData = watch()

	const hasStep1Errors = STEP1_FIELDS.some((f) => errors[f])
	const hasStep2Errors = STEP2_FIELDS.some((f) => errors[f])
	// capacity/ratio have defaults, only need to check name and ages are filled
	const isStep1Valid =
		!hasStep1Errors && formData.name.trim().length > 0 && formData.minAge !== undefined && formData.maxAge !== undefined
	const isStep2Valid = !hasStep2Errors

	const handleNext = async () => {
		const fieldsToValidate = currentStep === 0 ? STEP1_FIELDS : STEP2_FIELDS
		const stepValid = await trigger(fieldsToValidate)
		if (stepValid) {
			setCurrentStep((prev) => prev + 1)
		}
	}

	const handleBack = () => {
		if (currentStep === 0) {
			onCancel?.()
		} else {
			// Clear step 2 errors when going back so stale cross-field
			// validations (e.g. studentIds vs capacity) don't persist
			if (currentStep === 1) {
				for (const field of STEP2_FIELDS) {
					form.clearErrors(field)
				}
			}
			setCurrentStep((prev) => prev - 1)
		}
	}

	const handleComplete = handleSubmit((data) => {
		onComplete?.(data)
	})

	return (
		<FormProvider {...form}>
			<div className="w-full">
				<Stepper
					backLabel={currentStep === 0 ? t("common.close") : t("common.back")}
					completeLabel={t("rooms.addRoom.title")}
					currentStep={currentStep}
					hideBackOnFirstStep={false}
					isNextDisabled={(currentStep === 0 && !isStep1Valid) || (currentStep === 1 && !isStep2Valid)}
					isNextLoading={isLoading}
					nextLabel={t("common.next")}
					onBack={handleBack}
					onComplete={handleComplete}
					onNext={handleNext}
					showValueLabel={false}
					steps={steps}
				/>
			</div>
		</FormProvider>
	)
}

export default AddRoomStepper
