import { Button, Progress } from "@heroui/react"

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
	nextLabel?: string
	backLabel?: string
	completeLabel?: string
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
	nextLabel = "Next",
	backLabel = "Back",
	completeLabel = "Complete",
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
				<Progress
					aria-label="Step progress"
					classNames={{
						base: "w-full",
						track: "h-3 bg-default-200",
						indicator: "bg-primary rounded-xl",
						labelWrapper: "mb-2",
						label: "text-base text-foreground",
						value: "text-base text-foreground text-right",
					}}
					label={currentStepData?.label}
					showValueLabel={showValueLabel}
					value={progressValue}
					valueLabel={nextStepData?.label ?? currentStepData?.label}
				/>
			</div>

			<div className="mb-6">{currentStepData?.content}</div>

			<div className="flex flex-col gap-3">
				<Button
					color="primary"
					fullWidth
					isDisabled={isNextDisabled}
					isLoading={isNextLoading}
					onPress={handleNextClick}
					size="lg"
				>
					{isLastStep ? completeLabel : nextLabel}
				</Button>

				{!(hideBackOnFirstStep && isFirstStep) && (
					<Button color="default" fullWidth onPress={onBack} size="lg">
						{backLabel}
					</Button>
				)}
			</div>
		</div>
	)
}

export default Stepper
