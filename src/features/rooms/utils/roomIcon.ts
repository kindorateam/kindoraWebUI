import type { RoomType } from "../types"

export const getRoomIcon = (roomType: RoomType) => {
	switch (roomType) {
		case "turtle":
			return "🐢"
		case "rabbit":
			return "🐰"
		case "bear":
			return "🐻"
		case "butterfly":
			return "🦋"
		case "owl":
			return "🦉"
		case "fox":
			return "🦊"
	}
}

export const getRoomIconBg = (roomType: RoomType) => {
	switch (roomType) {
		case "turtle":
			return "bg-gradient-green"
		case "rabbit":
			return "bg-gradient-blue"
		case "bear":
			return "bg-gradient-orange"
		case "butterfly":
			return "bg-gradient-purple"
		case "owl":
			return "bg-gradient-gray"
		case "fox":
			return "bg-gradient-red"
	}
}

export default getRoomIconBg
