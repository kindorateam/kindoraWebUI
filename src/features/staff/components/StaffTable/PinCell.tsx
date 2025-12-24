import { Button } from "@heroui/react"
import { useState } from "react"

import TablerEye from "~icons/tabler/eye"
import TablerEyeOff from "~icons/tabler/eye-off"

interface PinCellProps {
	pinCode: number | null | undefined
}

export default function PinCell({ pinCode }: PinCellProps) {
	const [isVisible, setIsVisible] = useState(false)

	if (pinCode === null || pinCode === undefined) {
		return <span className="text-gray-500 text-sm">—</span>
	}

	const pinString = String(pinCode)
	const maskedPin = "•".repeat(pinString.length)

	return (
		<div className="flex items-center gap-1">
			<span className="min-w-10 text-gray-500 text-sm tabular-nums">
				{isVisible ? pinString : maskedPin}
			</span>
			<Button
				isIconOnly
				size="sm"
				variant="light"
				onPress={() => setIsVisible(!isVisible)}
				aria-label={isVisible ? "Hide PIN" : "Show PIN"}
			>
				{isVisible ? (
					<TablerEyeOff className="size-4 text-gray-400" />
				) : (
					<TablerEye className="size-4 text-gray-400" />
				)}
			</Button>
		</div>
	)
}
