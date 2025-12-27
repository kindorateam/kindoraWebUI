import { Button } from "@heroui/react"

interface SectionHeaderProps {
	icon: React.ReactNode
	title: string
	onEdit?: () => void
}

export default function SectionHeader({ icon, title, onEdit }: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2.5 px-4 py-1.5">
				<span className="text-[#2e2659]">{icon}</span>
				<span className="font-semibold text-[#2e2659] text-sm">{title}</span>
			</div>
			{onEdit && (
				<Button color="primary" radius="md" size="md" onPress={onEdit}>
					Edit
				</Button>
			)}
		</div>
	)
}
