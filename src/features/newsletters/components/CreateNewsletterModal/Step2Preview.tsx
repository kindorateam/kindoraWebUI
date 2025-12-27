import { Card, CardBody } from "@heroui/react"

import { hasNewsletterContent } from "../../utils/newsletter-content"

import "./newsletter-editor.css"

interface Step2PreviewProps {
	content: string
}

const Step2Preview = ({ content }: Step2PreviewProps) => {
	if (!hasNewsletterContent(content)) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-default-400">No content to preview</p>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-2xl p-6">
			<p className="mb-4 text-center text-default-500 text-sm">Preview how your newsletter will appear to recipients</p>

			<Card className="border border-default-200" shadow="sm">
				<CardBody className="p-8">
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Content comes from local editor state. */}
					<div className="newsletter-editor newsletter-preview" dangerouslySetInnerHTML={{ __html: content }} />
				</CardBody>
			</Card>
		</div>
	)
}

export default Step2Preview
