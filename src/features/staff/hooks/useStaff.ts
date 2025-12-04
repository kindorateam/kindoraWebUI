import { useQuery } from "@tanstack/react-query"
import { useCallback, useState } from "react"

import { getStaffMembers } from "../services/staff.service"

import type { PinVisibility, Staff } from "../types"

export const useStaff = () => {
	return useQuery<Staff[], Error>({
		queryKey: ["staff"],
		queryFn: getStaffMembers,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})
}

export const usePinVisibility = () => {
	const [pinVisibility, setPinVisibility] = useState<PinVisibility>({})

	const togglePinVisibility = useCallback((staffId: string) => {
		setPinVisibility((prev) => ({
			...prev,
			[staffId]: !prev[staffId],
		}))
	}, [])

	const isPinVisible = useCallback(
		(staffId: string): boolean => {
			return pinVisibility[staffId] ?? false
		},
		[pinVisibility],
	)

	return {
		isPinVisible,
		togglePinVisibility,
	}
}
