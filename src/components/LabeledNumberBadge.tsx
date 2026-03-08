import NumberBadge from "./NumberBadge"

interface LabeledNumberBadgeProps {
	badgeVariant?: "default" | "circle"
	icon?: React.ReactNode
	label: string
	value?: number
}

const LabeledNumberBadge = ({ badgeVariant, icon, label, value }: LabeledNumberBadgeProps) => {
	return (
		<div className="flex items-center gap-2">
			<span className="">{label}</span>
			{!icon && value !== undefined && <NumberBadge value={value} variant={badgeVariant} />}
			{icon && <span className="flex h-7 w-7 items-center justify-center text-brand">{icon}</span>}
		</div>
	)
}

export default LabeledNumberBadge
