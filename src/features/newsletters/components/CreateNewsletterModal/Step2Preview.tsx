import { Card } from "@heroui/react"

import { hasNewsletterContent } from "../../utils/newsletter-content"
import { sanitizeNewsletterHtml } from "../../utils/newsletter-html"

import "./newsletter-editor.css"

interface Step2PreviewProps {
	content: string
}

const Step2Preview = ({ content }: Step2PreviewProps) => {
	const previewContent = sanitizeNewsletterHtml(content)

	if (!hasNewsletterContent(previewContent)) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-default-400">No content to preview</p>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-2xl p-6">
			<p className="mb-4 text-center text-default-500 text-sm">Preview how your newsletter will appear to recipients</p>

			<Card>
				<Card.Content>
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Newsletter HTML is sanitized before rendering. */}
					<div className="newsletter-editor newsletter-preview" dangerouslySetInnerHTML={{ __html: previewContent }} />
				</Card.Content>
			</Card>
		</div>
	)
}

export default Step2Preview
