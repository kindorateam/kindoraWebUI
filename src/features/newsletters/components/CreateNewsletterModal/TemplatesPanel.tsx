import { Card } from "@heroui/react"

interface Template {
	id: string
	name: string
	html: string
}

interface TemplatesPanelProps {
	onSelectTemplate: (html: string) => void
}

// Mock templates - will be replaced with API data
const mockTemplates: Template[] = [
	{
		id: "1",
		name: "Welcome Email",
		html: "<h1>Welcome to our newsletter!</h1><p>Thank you for subscribing. We're excited to have you!</p>",
	},
	{
		id: "2",
		name: "Monthly Update",
		html: "<h1>Monthly Update</h1><p>Here's what happened this month...</p><ul><li>News item 1</li><li>News item 2</li></ul>",
	},
	{
		id: "3",
		name: "Event Announcement",
		html: "<h1>You're Invited!</h1><p>Join us for our upcoming event.</p><p><strong>Date:</strong> TBD</p><p><strong>Location:</strong> TBD</p>",
	},
]

const TemplatesPanel = ({ onSelectTemplate }: TemplatesPanelProps) => {
	if (mockTemplates.length === 0) {
		return (
			<div className="py-8 text-center">
				<p className="text-default-400 text-sm">No templates saved yet</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2">
			<p className="text-default-500 text-xs">Click to apply template</p>
			{mockTemplates.map((template) => (
				<Card
					key={template.id}
					className="cursor-pointer border border-default-200 shadow-none"
					onClick={() => onSelectTemplate(template.html)}
				>
					<Card.Content className="p-3">
						<p className="font-medium text-sm">{template.name}</p>
					</Card.Content>
				</Card>
			))}
		</div>
	)
}

export default TemplatesPanel
