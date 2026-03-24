import { Tabs } from "@heroui/react"
import { useState } from "react"

import NewsletterEditor from "./NewsletterEditor"
import TemplatesPanel from "./TemplatesPanel"

interface Step1EditorProps {
	content: string
	onChange: (html: string) => void
	onLoadTemplate: (html: string) => void
}

const Step1Editor = ({ content, onChange, onLoadTemplate }: Step1EditorProps) => {
	const [activeTab, setActiveTab] = useState<"editor" | "templates">("editor")

	return (
		<div className="flex h-full">
			{/* Left Panel - Tabs */}
			<div className="w-48 shrink-0 border-r">
				<div className="p-3">
					<Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as "editor" | "templates")}>
						<Tabs.ListContainer>
							<Tabs.List aria-label="Editor panels" className="w-full">
								<Tabs.Tab id="editor">
									Editor
									<Tabs.Indicator />
								</Tabs.Tab>
								<Tabs.Tab id="templates">
									Templates
									<Tabs.Indicator />
								</Tabs.Tab>
							</Tabs.List>
						</Tabs.ListContainer>
					</Tabs>
				</div>

				{activeTab === "templates" && (
					<div className="p-3 pt-0">
						<TemplatesPanel onSelectTemplate={onLoadTemplate} />
					</div>
				)}
			</div>

			{/* Right Panel - Editor */}
			<div className="flex-1 bg-default-50">
				<NewsletterEditor content={content} onChange={onChange} />
			</div>
		</div>
	)
}

export default Step1Editor
