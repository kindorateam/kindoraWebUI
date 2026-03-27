import { useState } from "react"

import type { PinVisibility } from "@/types/staff"

const usePinVisibility = () => {
	const [pinVisibility, setPinVisibility] = useState<PinVisibility>({})

	const togglePinVisibility = (staffId: string) => {
		setPinVisibility((prev) => ({
			...prev,
			[staffId]: !prev[staffId],
		}))
	}

	const isPinVisible = (staffId: string): boolean => {
		return pinVisibility[staffId] ?? false
	}

	const hidePinForStaff = (staffId: string) => {
		setPinVisibility((prev) => ({
			...prev,
			[staffId]: false,
		}))
	}

	const showPinForStaff = (staffId: string) => {
		setPinVisibility((prev) => ({
			...prev,
			[staffId]: true,
		}))
	}

	return {
		isPinVisible,
		togglePinVisibility,
		hidePinForStaff,
		showPinForStaff,
	}
}

export default usePinVisibility
