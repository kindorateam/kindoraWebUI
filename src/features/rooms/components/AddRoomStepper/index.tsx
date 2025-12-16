import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import Stepper from "@/components/Stepper"

import { addRoomSchema } from "../../schemas/addRoom.schema"

import AddStaffStudentsStep from "./AddStaffStudentsStep"
import ConfirmRoomStep from "./ConfirmRoomStep"
import RoomDetailsStep from "./RoomDetailsStep"

import type { AddRoomFormData } from "../../types"

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

	const isStep1Valid =
		!errors.name && !errors.capacity && !errors.ratio && formData.name && formData.capacity >= 1 && formData.ratio >= 1
	const isStep2Valid = !errors.staffIds && !errors.studentIds

	const handleNext = async () => {
		// Validate current step fields before proceeding
		const fieldsToValidate =
			currentStep === 0 ? (["name", "capacity", "ratio"] as const) : (["staffIds", "studentIds"] as const)
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
			<div className="w-full max-w-[496px] rounded-2xl bg-white p-7">
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
