import { Avatar } from "@heroui/react"
import { Link } from "@tanstack/react-router"

import RoomIcon from "@/components/RoomIcon"

import type { Room } from "@/types/room"
import type { TableColumn } from "@/types/table"

const createRoomsColumns = (): TableColumn<Room>[] => [
	{
		key: "room",
		label: "Rooms",
		renderCell: (room) => (
			<Link
				className="flex items-center gap-2 hover:text-primary"
				params={{ roomId: room.id }}
				search={{ tab: "students" }}
				to="/rooms/$roomId"
			>
				<RoomIcon roomType={room.icon} />
				<span className="font-medium text-sm">{room.name}</span>
			</Link>
		),
	},
	{
		key: "capacity",
		label: "Capacity",
		renderCell: (room) => <span className="text-gray-600 text-sm">{room.capacity}</span>,
	},
	{
		key: "students",
		label: "Students",
		renderCell: (room) => <span className="text-gray-600 text-sm">{room.studentsCount}</span>,
	},
	{
		key: "staff",
		label: "Staff",
		renderCell: (room) => <span className="text-gray-600 text-sm">{room.staffCount}</span>,
	},
	{
		key: "signInStudents",
		label: "Sign in students",
		renderCell: (room) => {
			const { signedInStudents } = room
			const totalStudents = signedInStudents.length

			if (totalStudents === 0) {
				return <span className="text-gray-400 text-sm">No students</span>
			}

			const displayCount = Math.min(2, totalStudents)
			const remainingCount = totalStudents - displayCount

			return (
				<div className="-space-x-2 flex items-center">
					{signedInStudents.slice(0, displayCount).map((student) => (
						<Avatar
							alt={student.name}
							className="h-8 w-8 border-2 border-white"
							key={student.id}
							showFallback
							src={student.avatar}
						/>
					))}
					{remainingCount > 0 && (
						<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200">
							<span className="font-semibold text-gray-700 text-xs">+{remainingCount}</span>
						</div>
					)}
					<span className="ml-3 text-gray-600 text-sm">({totalStudents})</span>
				</div>
			)
		},
	},
	{
		key: "signInStaff",
		label: "Sign in staff",
		renderCell: (room) => {
			const { signedInStaff } = room
			const totalStaff = signedInStaff.length

			if (totalStaff === 0) {
				return <span className="text-gray-400 text-sm">No staff</span>
			}

			const displayCount = Math.min(3, totalStaff)

			return (
				<div className="-space-x-2 flex items-center">
					{signedInStaff.slice(0, displayCount).map((staff) => (
						<Avatar
							alt={staff.name}
							className="h-8 w-8 border-2 border-white"
							key={staff.id}
							showFallback
							src={staff.avatar}
						/>
					))}
				</div>
			)
		},
	},
]

export default createRoomsColumns
