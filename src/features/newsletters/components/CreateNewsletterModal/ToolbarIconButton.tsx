import { Button, Tooltip } from "@heroui/react"

import type React from "react"

interface ToolbarIconButtonProps {
	icon: React.ReactNode
	onPress: () => void
	tooltip: string
	isActive?: boolean
	isDisabled?: boolean
}

const ToolbarIconButton = ({
	icon,
	onPress,
	tooltip,
	isActive = false,
	isDisabled = false,
}: ToolbarIconButtonProps) => (
	<Tooltip delay={0}>
		<Button isIconOnly isDisabled={isDisabled} onPress={onPress} size="sm" variant={isActive ? "secondary" : "ghost"}>
			{icon}
		</Button>
		<Tooltip.Content>{tooltip}</Tooltip.Content>
	</Tooltip>
)

export default ToolbarIconButton
