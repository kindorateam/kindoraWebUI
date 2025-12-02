import { Avatar, AvatarGroup, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"
import { Link } from "@tanstack/react-router"

import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"
import TablerTrash from "~icons/tabler/trash"

import RoomIcon from "../RoomIcon"

import type { Room } from "../../types"

interface AvatarItem {
	id: string
	name: string
	avatar: string
}

function renderAvatarGroup(items: AvatarItem[]) {
	if (items.length === 0) {
		return <span className="text-gray-400 text-sm">No one</span>
	}

	const extraCount = items.length - 2

	return (
		<div className="flex justify-center">
			<AvatarGroup>
				{items.slice(0, 2).map((item) => (
					<Avatar
						alt={item.name}
						classNames={{ base: "ring-green-500" }}
						isBordered
						key={item.id}
						showFallback
						size="sm"
						src={item.avatar}
					/>
				))}
				{extraCount > 0 && <Avatar name={`${extraCount}`} size="sm" />}
			</AvatarGroup>
		</div>
	)
}

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
			const checkedInStudents = room.signedInStudents.filter((student) => student.checkedIn)
			return renderAvatarGroup(checkedInStudents)
		}

		case "signInStaff": {
			const checkedInStaff = room.signedInStaff.filter((staff) => staff.checkedIn)
			return renderAvatarGroup(checkedInStaff)
		}

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown classNames={{ content: "min-w-0" }}>
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
							<DropdownItem
								key="view"
								className="text-success"
								startContent={<TablerEye aria-hidden className="size-5" />}
							>
								View
							</DropdownItem>
							<DropdownItem
								key="edit"
								className="text-warning"
								startContent={<TablerEdit aria-hidden className="size-5" />}
							>
								Edit
							</DropdownItem>
							<DropdownItem
								key="deactivate"
								className="text-danger"
								startContent={<TablerTrash aria-hidden className="size-5" />}
							>
								Deactivate
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}
