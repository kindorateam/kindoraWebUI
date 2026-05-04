import { Button, Modal } from "@heroui/react"
import { useEffect, useRef, useState } from "react"

import { hasNewsletterContent } from "../../utils/newsletter-content"
import { sanitizeNewsletterHtml } from "../../utils/newsletter-html"

import Step1Editor from "./Step1Editor"
import Step2Preview from "./Step2Preview"

interface CreateNewsletterModalProps {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}

const CreateNewsletterModal = ({ isOpen, onOpenChange }: CreateNewsletterModalProps) => {
	const [currentStep, setCurrentStep] = useState<1 | 2>(1)
	const [content, setContent] = useState("")
	const [hasContent, setHasContent] = useState(false)
	const contentGetterRef = useRef<(() => string) | null>(null)

	useEffect(() => {
		if (!isOpen) {
			setCurrentStep(1)
			setContent("")
			setHasContent(false)
			contentGetterRef.current = null
		}
	}, [isOpen])

	const setContentGetter = (getter: (() => string) | null) => {
		contentGetterRef.current = getter
	}

	const captureCurrentContent = () => {
		const nextContent = sanitizeNewsletterHtml(contentGetterRef.current?.() ?? content)
		setContent(nextContent)
		setHasContent(hasNewsletterContent(nextContent))
		return nextContent
	}

	const handleLoadTemplate = (html: string) => {
		const nextContent = sanitizeNewsletterHtml(html)
		setContent(nextContent)
		setHasContent(hasNewsletterContent(nextContent))
	}

	const handleSaveDraft = () => {
		// TODO: Implement save draft API
		captureCurrentContent()
	}

	const handleAddToTemplates = () => {
		// TODO: Implement add to templates
		captureCurrentContent()
	}

	const handleSend = () => {
		// TODO: Implement send API
		const nextContent = captureCurrentContent()
		if (!hasNewsletterContent(nextContent)) return
		onOpenChange(false)
	}

	const nextStep = () => {
		captureCurrentContent()
		setCurrentStep(2)
	}
	const prevStep = () => setCurrentStep(1)

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
			<Modal.Container size="cover">
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<div className="flex w-full items-center justify-between gap-4 pr-9">
							<Modal.Heading>Create newsletter</Modal.Heading>
							<span className="shrink-0 text-default-500 text-sm">
								Step <span className="font-semibold text-foreground">{currentStep}/2</span>
							</span>
						</div>
					</Modal.Header>

					<Modal.Body>
						<div className="h-full min-h-125">
							{currentStep === 1 ? (
								<Step1Editor
									content={content}
									onContentPresenceChange={setHasContent}
									onEditorContentGetterChange={setContentGetter}
									onLoadTemplate={handleLoadTemplate}
								/>
							) : (
								<Step2Preview content={content} />
							)}
						</div>
					</Modal.Body>

					<Modal.Footer>
						<div className="flex w-full justify-between">
							{currentStep === 1 ? (
								<>
									<Button onPress={handleAddToTemplates} variant="secondary">
										Add to templates
									</Button>
									<div className="flex gap-3">
										<Button onPress={handleSaveDraft} variant="secondary">
											Save draft
										</Button>
										<Button variant="primary" isDisabled={!hasContent} onPress={nextStep}>
											Preview →
										</Button>
									</div>
								</>
							) : (
								<>
									<div />
									<div className="flex gap-3">
										<Button onPress={prevStep} variant="ghost">
											← Back
										</Button>
										<Button variant="primary" isDisabled={!hasContent} onPress={handleSend}>
											Send
										</Button>
									</div>
								</>
							)}
						</div>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default CreateNewsletterModal
