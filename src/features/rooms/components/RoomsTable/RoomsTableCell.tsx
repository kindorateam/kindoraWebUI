import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"
import { Link, useRouter } from "@tanstack/react-router"

import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"
import TablerPlayerPlay from "~icons/tabler/player-play"
import TablerTrash from "~icons/tabler/trash"

import { useActivateRoom } from "../../hooks/useRooms"
import { openDeactivateRoomModal } from "../../stores/deactivateRoomModal.store"
import RoomIcon from "../RoomIcon"

import SignedInAvatarGroup from "./SignedInAvatarGroup"

import type { Room } from "../../types"

interface RoomsTableCellProps {
	room: Room
	columnKey: React.Key
}

const RoomsTableCell = ({ room, columnKey }: RoomsTableCellProps) => {
	const router = useRouter()
	const activateMutation = useActivateRoom()
	const isInactive = room.status === "inactive"

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
			return <SignedInAvatarGroup items={checkedInStudents} tooltipLabel="Signed-in students" />
		}

		case "signInStaff": {
			const checkedInStaff = room.signedInStaff.filter((staff) => staff.checkedIn)
			return <SignedInAvatarGroup items={checkedInStaff} tooltipLabel="Signed-in staff" />
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
								onPress={() => {
									void router.navigate({
										to: "/rooms/$roomId",
										params: { roomId: room.id },
										search: { tab: "students" },
									})
								}}
							>
								View
							</DropdownItem>
							<DropdownItem
								key="edit"
								className="text-warning"
								startContent={<TablerEdit aria-hidden className="size-5" />}
								onPress={() => {
									void router.navigate({
										to: "/rooms/$roomId",
										params: { roomId: room.id },
										search: { tab: "profile" },
									})
								}}
							>
								Edit
							</DropdownItem>
							{isInactive ? (
								<DropdownItem
									key="activate"
									className="text-success"
									startContent={<TablerPlayerPlay aria-hidden className="size-5" />}
									onPress={() => activateMutation.mutate(room.id)}
								>
									Activate
								</DropdownItem>
							) : (
								<DropdownItem
									key="deactivate"
									className="text-danger"
									startContent={<TablerTrash aria-hidden className="size-5" />}
									onPress={() => openDeactivateRoomModal(room.id, room.name)}
								>
									Deactivate
								</DropdownItem>
							)}
						</DropdownMenu>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}

export default RoomsTableCell
