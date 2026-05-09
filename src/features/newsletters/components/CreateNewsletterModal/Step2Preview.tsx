import { Card } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { hasNewsletterContent } from "../../utils/newsletter-content"
import { sanitizeNewsletterHtml } from "../../utils/newsletter-html"

import "./newsletter-editor.css"

interface Step2PreviewProps {
	content: string
}

const Step2Preview = ({ content }: Step2PreviewProps) => {
	const { t } = useTranslation()
	const previewContent = sanitizeNewsletterHtml(content)

	if (!hasNewsletterContent(previewContent)) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-default-400">{t("newsletters.preview.empty")}</p>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-2xl p-6">
			<p className="mb-4 text-center text-default-500 text-sm">{t("newsletters.preview.description")}</p>

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
