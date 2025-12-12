import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react"
import { useState } from "react"

import Step1Editor from "./Step1Editor"
import Step2Preview from "./Step2Preview"

interface CreateNewsletterModalProps {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}

const CreateNewsletterModal = ({ isOpen, onOpenChange }: CreateNewsletterModalProps) => {
	const [currentStep, setCurrentStep] = useState<1 | 2>(1)
	const [content, setContent] = useState("")

	const handleClose = () => {
		onOpenChange(false)
		setCurrentStep(1)
		setContent("")
	}

	const handleSaveDraft = () => {
		// TODO: Implement save draft API
		console.log("Saving draft:", content)
	}

	const handleAddToTemplates = () => {
		// TODO: Implement add to templates
		console.log("Adding to templates:", content)
	}

	const handleSend = () => {
		// TODO: Implement send API
		console.log("Sending newsletter:", content)
		handleClose()
	}

	const nextStep = () => setCurrentStep(2)
	const prevStep = () => setCurrentStep(1)

	return (
		<Modal
			classNames={{
				closeButton: "cursor-pointer",
				base: "max-h-[90vh]",
			}}
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open) handleClose()
				else onOpenChange(open)
			}}
			placement="center"
			size="5xl"
			scrollBehavior="inside"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex justify-between">
							<span className="font-semibold text-xl">Create newsletter</span>
							<span className="text-default-500 text-sm">Step {currentStep}/2</span>
						</ModalHeader>

						<ModalBody className="min-h-[500px] overflow-y-auto p-0">
							{currentStep === 1 ? (
								<Step1Editor content={content} onChange={setContent} onLoadTemplate={setContent} />
							) : (
								<Step2Preview content={content} />
							)}
						</ModalBody>

						<ModalFooter className="flex justify-between">
							{currentStep === 1 ? (
								<>
									<Button color="default" onPress={handleAddToTemplates} variant="light">
										Add to templates
									</Button>
									<div className="flex gap-3">
										<Button color="default" onPress={handleSaveDraft} variant="flat">
											Save draft
										</Button>
										<Button color="primary" onPress={nextStep}>
											Preview →
										</Button>
									</div>
								</>
							) : (
								<>
									<div />
									<div className="flex gap-3">
										<Button color="default" onPress={prevStep} variant="flat">
											← Back
										</Button>
										<Button color="primary" onPress={handleSend}>
											Send
										</Button>
									</div>
								</>
							)}
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default CreateNewsletterModal
