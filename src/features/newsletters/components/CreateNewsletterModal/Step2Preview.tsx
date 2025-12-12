import { Card, CardBody } from "@heroui/react"

import "./newsletter-editor.css"

interface Step2PreviewProps {
	content: string
}

const Step2Preview = ({ content }: Step2PreviewProps) => {
	if (!content || content === "<p></p>") {
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
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Newsletter content is sanitized by Tiptap */}
					<div className="newsletter-editor" dangerouslySetInnerHTML={{ __html: content }} />
				</CardBody>
			</Card>
		</div>
	)
}

export default Step2Preview
