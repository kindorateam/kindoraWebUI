import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import Stepper from "@/components/Stepper"

import { addStaffSchema } from "../../schemas/addStaff.schema"

import StaffDetailsStep from "./StaffDetailsStep"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const STEP1_FIELDS = ["firstName", "lastName", "role", "email", "inviteToKindora"] as const

interface AddStaffStepperProps {
	onComplete?: (data: AddStaffFormData) => void
	onCancel?: () => void
	isLoading?: boolean
}

const steps = [
	{
		key: "details",
		label: "Step 1/8",
		content: <StaffDetailsStep />,
	},
	// Future steps will be added here
]

const AddStaffStepper = ({ onComplete, onCancel, isLoading = false }: AddStaffStepperProps) => {
	const [currentStep, setCurrentStep] = useState(0)

	const form = useForm<AddStaffFormData>({
		resolver: zodResolver(addStaffSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			role: "",
			email: "",
			inviteToKindora: true,
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
	const isStep1Valid =
		!hasStep1Errors &&
		formData.firstName.trim().length > 0 &&
		formData.lastName.trim().length > 0 &&
		formData.role.length > 0 &&
		formData.email.length > 0

	const handleNext = async () => {
		const stepValid = await trigger(STEP1_FIELDS as unknown as (keyof AddStaffFormData)[])
		if (stepValid) {
			if (currentStep === steps.length - 1) {
				// Last step - complete
				handleSubmit((data) => onComplete?.(data))()
			} else {
				setCurrentStep((prev) => prev + 1)
			}
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
					completeLabel="Next"
					currentStep={currentStep}
					hideBackOnFirstStep={false}
					isNextDisabled={currentStep === 0 && !isStep1Valid}
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

export default AddStaffStepper
