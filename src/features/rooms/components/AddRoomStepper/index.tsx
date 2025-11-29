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
				<div className="flex flex-col gap-6">
					<h2 className="font-medium text-xl">Confirm Room Details</h2>
					<div className="flex justify-center">
						<Avatar
							className="size-14 text-lg"
							color="primary"
							name={formData.name}
							showFallback
							src={formData.avatarPreview}
						/>
					</div>
					<div className="flex justify-between">
						<div className="flex flex-col gap-3">
							<p className="text-base">
								<span className="font-medium">Name:</span>{" "}
								<span className="text-neutral-700">{formData.name}</span>
							</p>
							<p className="text-base">
								<span className="font-medium">Capacity:</span>{" "}
								<span className="text-neutral-700">{formData.capacity}</span>
							</p>
							<p className="text-base">
								<span className="font-medium">Ratio:</span>{" "}
								<span className="text-neutral-700">{formData.ratio}:1</span>
							</p>
						</div>
						<div className="flex flex-col gap-3">
							<p className="text-base">
								<span className="font-medium">Staff:</span>{" "}
								<span className="text-neutral-700">{formData.staffIds?.length || 0} selected</span>
							</p>
							<p className="text-base">
								<span className="font-medium">Students:</span>{" "}
								<span className="text-neutral-700">{formData.studentIds?.length || 0} selected</span>
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
