import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import Stepper from "@/components/Stepper"

import { addStaffSchema } from "../../schemas/addStaff.schema"

import CertificationStep from "./CertificationStep"
import KindoraRoleStep from "./KindoraRoleStep"
import PersonalInfoStep from "./PersonalInfoStep"
import StaffDetailsStep from "./StaffDetailsStep"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const STEP1_FIELDS = ["firstName", "lastName", "role", "email", "inviteToKindora"] as const
const STEP2_FIELDS = ["phone", "birthday", "enrollDate", "state", "city", "streetAddress", "zipCode", "notes"] as const
const STEP3_FIELDS = ["degree", "certification"] as const
const STEP4_FIELDS = ["hireDate", "assignedRooms", "permissions"] as const

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
	{
		key: "personal-info",
		label: "Step 2/8",
		content: <PersonalInfoStep />,
	},
	{
		key: "certification",
		label: "Step 3/8",
		content: <CertificationStep />,
	},
	{
		key: "kindora-role",
		label: "Step 4/8",
		content: <KindoraRoleStep />,
	},
	// Future steps will be added here
]

const AddStaffStepper = ({ onComplete, onCancel, isLoading = false }: AddStaffStepperProps) => {
	const [currentStep, setCurrentStep] = useState(0)

	const form = useForm<AddStaffFormData>({
		resolver: zodResolver(addStaffSchema),
		defaultValues: {
			// Step 1: Basic Info (mock data)
			firstName: "Sarah",
			lastName: "Johnson",
			role: "teacher",
			email: "sarah.johnson@example.com",
			inviteToKindora: true,
			// Step 2: Personal Info (mock data)
			phone: "(415) 555-5678",
			birthday: "1988-06-16",
			enrollDate: "2025-08-15",
			state: "FL",
			city: "Miami",
			streetAddress: "123 Peachtree Street NE",
			zipCode: "33101",
			notes: "",
			// Step 3: Certification (mock data)
			degree: "phd",
			certification: "0-00",
			// Step 4: Kindora role & status (mock data)
			hireDate: "2025-10-16",
			assignedRooms: ["room-1", "room-2"],
			permissions: ["view_students", "edit_students", "view_reports"],
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

	const getStepFields = (step: number) => {
		switch (step) {
			case 0:
				return STEP1_FIELDS
			case 1:
				return STEP2_FIELDS
			case 2:
				return STEP3_FIELDS
			case 3:
				return STEP4_FIELDS
			default:
				return []
		}
	}

	const isStepValid = (step: number) => {
		switch (step) {
			case 0:
				return isStep1Valid
			case 1:
				// Step 2 is optional, always valid
				return true
			default:
				return true
		}
	}

	const handleNext = async () => {
		const stepFields = getStepFields(currentStep)
		const stepValid = await trigger(stepFields as unknown as (keyof AddStaffFormData)[])
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

	const handleSkipOptionalSteps = () => {
		// Skip directly to completion
		handleSubmit((data) => onComplete?.(data))()
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
					isNextDisabled={!isStepValid(currentStep)}
					isNextLoading={isLoading}
					onBack={handleBack}
					onComplete={handleComplete}
					onNext={handleNext}
					onSkipOptional={currentStep > 0 ? handleSkipOptionalSteps : undefined}
					showValueLabel={false}
					steps={steps}
				/>
			</div>
		</FormProvider>
	)
}

export default AddStaffStepper
