import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"
import { Link } from "@tanstack/react-router"

import RoomIcon from "../RoomIcon"

import type { Room } from "../../types"

export function renderCell(room: Room, columnKey: React.Key) {
	switch (columnKey) {
		case "room":
			return (
				<Link
					className="flex items-center gap-2 hover:text-primary"
					params={{ roomId: room.id }}
					search={{ tab: "students" }}
					to="/rooms/$roomId"
				>
					<RoomIcon roomType={room.icon} />
					<span className="font-medium text-sm">{room.name}</span>
				</Link>
			)

		case "capacity":
			return <span className="text-gray-600 text-sm">{room.capacity}</span>

		case "students":
			return <span className="text-gray-600 text-sm">{room.studentsCount}</span>

		case "staff":
			return <span className="text-gray-600 text-sm">{room.staffCount}</span>

		case "signInStudents": {
			const { signedInStudents } = room
			const totalStudents = signedInStudents.length

			if (totalStudents === 0) {
				return <span className="text-gray-400 text-sm">No students</span>
			}

			const displayCount = Math.min(2, totalStudents)
			const remainingCount = totalStudents - displayCount

			return (
				<div className="flex justify-center">
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
					</div>
				</div>
			)
		}

		case "signInStaff": {
			const { signedInStaff } = room
			const totalStaff = signedInStaff.length

			if (totalStaff === 0) {
				return <span className="text-gray-400 text-sm">No staff</span>
			}

			const displayCount = Math.min(3, totalStaff)

			return (
				<div className="flex justify-center">
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
				</div>
			)
		}

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown>
						<DropdownTrigger>
							<Button isIconOnly radius="md" variant="light">
								<svg
									aria-hidden="true"
									className="size-5 text-gray-600"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									viewBox="0 0 24 24"
								>
									<circle cx={12} cy={12} r={1} />
									<circle cx={12} cy={5} r={1} />
									<circle cx={12} cy={19} r={1} />
								</svg>
							</Button>
						</DropdownTrigger>
						<DropdownMenu aria-label="Room actions">
							<DropdownItem key="view">View details</DropdownItem>
							<DropdownItem key="edit">Edit room</DropdownItem>
							<DropdownItem key="delete" className="text-danger" color="danger">
								Delete room
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}
