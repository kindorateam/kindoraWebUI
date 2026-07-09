import type { RoomStatus } from "./types"

export { getInitials } from "@/utils/name"

export const getAvatarUrl = (seed: string) => `https://i.pravatar.cc/80?u=${encodeURIComponent(seed)}`

export const getFirstName = (name?: string) => {
	if (!name) return "Sophia"

	return name.split(" ").find(Boolean) ?? "Sophia"
}

export const getRatioClassName = (tone: RoomStatus["ratioTone"]) => {
	if (tone === "success") return "bg-[#17c96426] text-[#17c964]"
	if (tone === "danger") return "bg-[#ff383c26] text-[#ff383c]"

	return "bg-[#f5a52426] text-[#f5a524]"
}
