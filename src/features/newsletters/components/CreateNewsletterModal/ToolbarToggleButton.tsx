import { ToggleButton, Tooltip } from "@heroui/react"

import type React from "react"

interface ToolbarToggleButtonProps {
	icon: React.ReactNode
	id: string
	tooltip: string
	isSelected?: boolean
	onPress?: () => void
}

const ToolbarToggleButton = ({ icon, id, onPress, tooltip, isSelected }: ToolbarToggleButtonProps) => (
	<Tooltip delay={0}>
		<ToggleButton
			aria-label={tooltip}
			className="data-[selected=true]:bg-default-200 data-[selected=true]:text-foreground data-[selected=true]:shadow-sm"
			id={id}
			isIconOnly
			isSelected={isSelected}
			onPress={onPress}
			size="sm"
			variant="ghost"
		>
			{icon}
		</ToggleButton>
		<Tooltip.Content>{tooltip}</Tooltip.Content>
	</Tooltip>
)

export default ToolbarToggleButton
