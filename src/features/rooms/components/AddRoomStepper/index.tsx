import { Avatar } from "@heroui/react"
import { useState } from "react"

import Stepper from "@/components/Stepper"

import RoomDetailsStep from "./RoomDetailsStep"

import type { AddRoomFormData } from "../../types"

const DEFAULT_FORM_DATA: AddRoomFormData = {
	name: "",
	capacity: 0,
}

interface AddRoomStepperProps {
	onComplete?: (data: AddRoomFormData) => void
	onCancel?: () => void
}

const AddRoomStepper = ({ onComplete, onCancel }: AddRoomStepperProps) => {
	const [currentStep, setCurrentStep] = useState(0)
	const [formData, setFormData] = useState<AddRoomFormData>(DEFAULT_FORM_DATA)

	const handleFormChange = (data: Partial<AddRoomFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }))
	}

	const handleNext = () => {
		setCurrentStep((prev) => prev + 1)
	}

	const handleBack = () => {
		if (currentStep === 0) {
			onCancel?.()
		} else {
			setCurrentStep((prev) => prev - 1)
		}
	}

	const handleComplete = () => {
		onComplete?.(formData)
	}

	const isStep1Valid = formData.name.trim() !== "" && formData.capacity > 0

	const steps = [
		{
			key: "details",
			label: "Step 1",
			content: <RoomDetailsStep formData={formData} onChange={handleFormChange} />,
		},
		{
			key: "confirm",
			label: "Step 2",
			content: (
				<div className="flex flex-col gap-4">
					<h2 className="font-medium text-xl">Confirm Room Details</h2>
					<div className="flex flex-col items-center gap-4 rounded-lg bg-default-100 p-4">
						<Avatar
							className="size-14 text-lg"
							color="primary"
							name={formData.name}
							showFallback
							src={formData.avatarPreview}
						/>
						<div className="w-full space-y-1">
							<p>
								<strong>Name:</strong> {formData.name}
							</p>
							<p>
								<strong>Capacity:</strong> {formData.capacity}
							</p>
						</div>
					</div>
				</div>
			),
		},
	]

	return (
		<div className="w-full max-w-[496px] rounded-2xl bg-white p-7">
			<Stepper
				completeLabel="Add Room"
				currentStep={currentStep}
				hideBackOnFirstStep={false}
				isNextDisabled={currentStep === 0 && !isStep1Valid}
				onBack={handleBack}
				onComplete={handleComplete}
				onNext={handleNext}
				steps={steps}
			/>
		</div>
	)
}

export default AddRoomStepper
