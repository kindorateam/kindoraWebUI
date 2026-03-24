import { Button, ProgressBar } from "@heroui/react"

export interface StepperStep {
	key: string
	label: string
	content: React.ReactNode
}

export interface StepperProps {
	steps: StepperStep[]
	currentStep: number
	onNext?: () => void
	onBack?: () => void
	onComplete?: () => void
	onSkipOptional?: () => void
	nextLabel?: string
	backLabel?: string
	completeLabel?: string
	skipOptionalLabel?: string
	isNextDisabled?: boolean
	isNextLoading?: boolean
	hideBackOnFirstStep?: boolean
	showValueLabel?: boolean
	className?: string
}

const Stepper = ({
	steps,
	currentStep,
	onNext,
	onBack,
	onComplete,
	onSkipOptional,
	nextLabel = "Next",
	backLabel = "Back",
	completeLabel = "Complete",
	skipOptionalLabel = "Skip all optional steps",
	isNextDisabled = false,
	isNextLoading = false,
	hideBackOnFirstStep = true,
	showValueLabel = true,
	className,
}: StepperProps) => {
	const isFirstStep = currentStep === 0
	const isLastStep = currentStep === steps.length - 1
	const progressValue = ((currentStep + 1) / steps.length) * 100

	const currentStepData = steps[currentStep]
	const nextStepData = steps[currentStep + 1]

	const handleNextClick = () => {
		if (isLastStep) {
			onComplete?.()
		} else {
			onNext?.()
		}
	}

	return (
		<div className={className}>
			<div className="mb-8">
				<div className="mb-2 flex justify-between">
					<span className="text-base text-foreground">{currentStepData?.label}</span>
					{showValueLabel && (
						<span className="text-right text-base text-foreground">
							{nextStepData?.label ?? currentStepData?.label}
						</span>
					)}
				</div>
				<ProgressBar aria-label="Step progress" className="w-full" value={progressValue}>
					<ProgressBar.Track className="h-3 bg-default-200">
						<ProgressBar.Fill className="rounded-xl bg-primary" />
					</ProgressBar.Track>
				</ProgressBar>
			</div>

			<div className="mb-6">{currentStepData?.content}</div>

			<div className="flex flex-col gap-3">
				<Button
					color="primary"
					fullWidth
					isDisabled={isNextDisabled}
					isLoading={isNextLoading}
					onPress={handleNextClick}
					size="md"
				>
					{isLastStep ? completeLabel : nextLabel}
				</Button>

				{onSkipOptional && (
					<Button fullWidth onPress={onSkipOptional} size="md">
						{skipOptionalLabel}
					</Button>
				)}

				{!(hideBackOnFirstStep && isFirstStep) && (
					<Button fullWidth onPress={onBack} size="md">
						{backLabel}
					</Button>
				)}
			</div>
		</div>
	)
}

export default Stepper
