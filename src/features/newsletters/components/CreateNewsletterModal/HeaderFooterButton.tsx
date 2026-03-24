import { Button, Tooltip } from "@heroui/react"

import TablerLayoutFooter from "~icons/tabler/layout-footer"
import TablerLayoutHeader from "~icons/tabler/layout-header"

interface HeaderFooterButtonProps {
	icon: React.ReactNode
	tooltip: string
	onPress: () => void
	isActive?: boolean
	isDisabled?: boolean
}

export const HeaderFooterButton = ({
	icon,
	tooltip,
	onPress,
	isActive = false,
	isDisabled = false,
}: HeaderFooterButtonProps) => (
	<Tooltip delay={500}>
		<Button
			isIconOnly
			isDisabled={isDisabled}
			onPress={onPress}
			size="sm"
			tabIndex={-1}
			variant={isActive ? "flat" : "light"}
		>
			{icon}
		</Button>
		<Tooltip.Content>{tooltip}</Tooltip.Content>
	</Tooltip>
)

export { TablerLayoutFooter, TablerLayoutHeader }
