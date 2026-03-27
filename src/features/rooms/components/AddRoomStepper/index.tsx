import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import Stepper from "@/components/Stepper"

import { addRoomSchema } from "../../schemas/addRoom.schema"

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

const steps = [
	{
		key: "details",
		label: "Step 1/3",
		content: <RoomDetailsStep />,
	},
	{
		key: "staff-students",
		label: "Step 2/3",
		content: <AddStaffStudentsStep />,
	},
	{
		key: "confirm",
		label: "Step 3/3",
		content: <ConfirmRoomStep />,
	},
]

const AddRoomStepper = ({ onComplete, onCancel, isLoading = false }: AddRoomStepperProps) => {
	const [currentStep, setCurrentStep] = useState(0)

	const form = useForm<AddRoomFormData>({
		resolver: zodResolver(addRoomSchema),
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
					backLabel={currentStep === 0 ? "Close" : "Back"}
					completeLabel="Add Room"
					currentStep={currentStep}
					hideBackOnFirstStep={false}
					isNextDisabled={(currentStep === 0 && !isStep1Valid) || (currentStep === 1 && !isStep2Valid)}
					isNextLoading={isLoading}
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
