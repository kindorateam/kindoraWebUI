import { Tabs } from "@heroui/react"
import { useState } from "react"

import NewsletterEditor from "./NewsletterEditor"
import TemplatesPanel from "./TemplatesPanel"

import type { Template } from "./TemplatesPanel"

interface Step1EditorProps {
	content: string
	onContentPresenceChange: (hasContent: boolean) => void
	onEditorContentGetterChange: (getter: (() => string) | null) => void
	onLoadTemplate: (html: string) => void
}

const Step1Editor = ({
	content,
	onContentPresenceChange,
	onEditorContentGetterChange,
	onLoadTemplate,
}: Step1EditorProps) => {
	const [activeTab, setActiveTab] = useState<"editor" | "templates">("editor")
	const [selectedTemplateId, setSelectedTemplateId] = useState<string>()

	const handleSelectTemplate = (template: Template) => {
		setSelectedTemplateId(template.id)
		onLoadTemplate(template.html)
	}

	return (
		<div className="flex h-full min-h-0">
			<div className="w-72 shrink-0 border-r pr-4">
				<Tabs
					className="w-full"
					selectedKey={activeTab}
					onSelectionChange={(key) => setActiveTab(key as "editor" | "templates")}
				>
					<Tabs.ListContainer className="w-full">
						<Tabs.List
							aria-label="Editor panels"
							className="w-full *:h-6 *:flex-1 *:px-3 *:font-normal *:text-sm *:data-[selected=true]:text-accent-foreground"
						>
							<Tabs.Tab id="editor">
								Editor
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
							<Tabs.Tab id="templates">
								Templates
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
						</Tabs.List>
					</Tabs.ListContainer>
				</Tabs>

				{activeTab === "templates" && (
					<div className="mt-4">
						<TemplatesPanel selectedTemplateId={selectedTemplateId} onSelectTemplate={handleSelectTemplate} />
					</div>
				)}
			</div>

			<div className="min-h-0 flex-1 bg-default-50">
				<NewsletterEditor
					content={content}
					onContentPresenceChange={onContentPresenceChange}
					onEditorContentGetterChange={onEditorContentGetterChange}
				/>
			</div>
		</div>
	)
}

export default Step1Editor
