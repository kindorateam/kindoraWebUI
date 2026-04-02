interface SectionHeaderProps {
	icon: React.ReactNode
	title: string
	action?: React.ReactNode
}

export default function SectionHeader({ icon, title, action }: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2.5">
				<span className="text-[#2e2659]">{icon}</span>
				<span className="font-semibold text-[#2e2659] text-sm">{title}</span>
			</div>
			{action}
		</div>
	)
}
