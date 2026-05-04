import { Card } from "@heroui/react"

import type React from "react"

export interface Template {
	description: string
	id: string
	html: string
	name: string
}

interface TemplatesPanelProps {
	selectedTemplateId?: string
	onSelectTemplate: (template: Template) => void
}

// Mock templates - will be replaced with API data
const mockTemplates: Template[] = [
	{
		id: "1",
		name: "Welcome Email",
		description: "Introduce Kindora to new families with a warm overview, benefits, and tour invitation.",
		html: `<header data-type="email-header">
			<h1>A brighter first school experience starts here</h1>
			<p>Kindora Preschool helps young children feel known, confident, and excited to learn through warm teachers, purposeful play, and daily parent connection.</p>
		</header>
		<img src="/newsletters/welcome-preschool-tour.svg" alt="Children learning at Kindora Preschool" width="1280">
		<h2>Give your child a joyful, confident start</h2>
		<p>Choosing a preschool is one of the first big education decisions your family makes. At Kindora, every classroom is designed to help children build independence, friendships, language, creativity, and school readiness at a pace that still feels like childhood.</p>
		<blockquote>
			<p><strong>Now welcoming new families:</strong> Book a private tour this week and see how our teachers turn everyday routines into meaningful learning moments.</p>
		</blockquote>
		<h3>Why parents choose Kindora</h3>
		<ul>
			<li>Small groups led by attentive teachers who know each child by name.</li>
			<li>Daily updates with classroom notes, photos, milestones, and sweet moments.</li>
			<li>Play-based learning that supports early literacy, math thinking, movement, art, and social growth.</li>
			<li>Gentle routines that help children feel secure from morning drop-off to afternoon pickup.</li>
		</ul>
		<h3>Inside a Kindora day</h3>
		<ul>
			<li>Morning welcome, songs, and classroom connection</li>
			<li>Hands-on projects, sensory play, and early discovery centers</li>
			<li>Outdoor movement, nature time, stories, and rest</li>
			<li>Teacher-guided social moments that build kindness and confidence</li>
		</ul>
		<hr>
		<h2>Come see the difference</h2>
		<p><strong>Ready to learn more?</strong> Reply to this newsletter to schedule a tour, ask about openings for your child's age group, or meet the teachers who will welcome your family.</p>
		<footer data-type="email-footer">
			<p><strong>Kindora Preschool</strong></p>
			<p>Bright beginnings, caring classrooms, and confident little learners.</p>
		</footer>`,
	},
	{
		id: "2",
		name: "Monthly Update",
		description: "Share classroom highlights, recent moments, and important monthly notes with families.",
		html: "<h1>Monthly Update</h1><p>Here's what happened this month...</p><ul><li>News item 1</li><li>News item 2</li></ul>",
	},
	{
		id: "3",
		name: "Event Announcement",
		description: "Announce an upcoming preschool event with date, location, and key details.",
		html: "<h1>You're Invited!</h1><p>Join us for our upcoming event.</p><p><strong>Date:</strong> TBD</p><p><strong>Location:</strong> TBD</p>",
	},
]

const TemplatesPanel = ({ selectedTemplateId, onSelectTemplate }: TemplatesPanelProps) => {
	const handleTemplateKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, template: Template) => {
		if (event.key !== "Enter" && event.key !== " ") return

		event.preventDefault()
		onSelectTemplate(template)
	}

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
			{mockTemplates.map((template) => {
				const isSelected = selectedTemplateId === template.id

				return (
					<Card
						aria-pressed={isSelected}
						className={[
							"cursor-pointer border-2 p-0 transition-colors focus-visible:outline-2 focus-visible:outline-primary",
							isSelected
								? "border-accent bg-accent-soft shadow-sm"
								: "border-transparent bg-default-100 hover:bg-default-200",
						].join(" ")}
						key={template.id}
						role="button"
						tabIndex={0}
						variant="secondary"
						onClick={() => onSelectTemplate(template)}
						onKeyDown={(event) => handleTemplateKeyDown(event, template)}
					>
						<Card.Content className="gap-1 p-3">
							<Card.Title
								className={["font-medium text-sm", isSelected ? "text-accent" : "text-default-900"].join(" ")}
							>
								{template.name}
							</Card.Title>
							<Card.Description className="text-default-500 text-xs leading-5">{template.description}</Card.Description>
						</Card.Content>
					</Card>
				)
			})}
		</div>
	)
}

export default TemplatesPanel
