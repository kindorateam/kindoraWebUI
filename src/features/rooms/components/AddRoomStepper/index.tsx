import { Avatar } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import Stepper from "@/components/Stepper"

import { addRoomSchema } from "../../schemas/addRoom.schema"

import AddStaffStudentsStep from "./AddStaffStudentsStep"
import RoomDetailsStep from "./RoomDetailsStep"

import type { AddRoomFormData } from "../../types"

interface AddRoomStepperProps {
	onComplete?: (data: AddRoomFormData) => void
	onCancel?: () => void
}

const AddRoomStepper = ({ onComplete, onCancel }: AddRoomStepperProps) => {
	const [currentStep, setCurrentStep] = useState(0)

	const form = useForm<AddRoomFormData>({
		resolver: zodResolver(addRoomSchema),
		defaultValues: {
			name: "",
			capacity: 1,
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

	const isStep1Valid = !errors.name && !errors.capacity && formData.name && formData.capacity >= 1
	const isStep2Valid =
		!errors.staffIds && !errors.studentIds && formData.staffIds?.length && formData.studentIds?.length

	const handleNext = async () => {
		// Validate current step fields before proceeding
		const fieldsToValidate = currentStep === 0 ? (["name", "capacity"] as const) : (["staffIds", "studentIds"] as const)
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

	const steps = [
		{
			key: "details",
			label: "Step 1",
			content: <RoomDetailsStep />,
		},
		{
			key: "staff-students",
			label: "Step 2",
			content: <AddStaffStudentsStep />,
		},
		{
			key: "confirm",
			label: "Step 3",
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
							<p>
								<strong>Staff:</strong> {formData.staffIds?.length || 0} selected
							</p>
							<p>
								<strong>Students:</strong> {formData.studentIds?.length || 0} selected
							</p>
						</div>
					</div>
				</div>
			),
		},
	]

	return (
		<FormProvider {...form}>
			<div className="w-full max-w-[496px] rounded-2xl bg-white p-7">
				<Stepper
					completeLabel="Add Room"
					currentStep={currentStep}
					hideBackOnFirstStep={false}
					isNextDisabled={(currentStep === 0 && !isStep1Valid) || (currentStep === 1 && !isStep2Valid)}
					onBack={handleBack}
					onComplete={handleComplete}
					onNext={handleNext}
					steps={steps}
				/>
			</div>
		</FormProvider>
	)
}

export default AddRoomStepper
