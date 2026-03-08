import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from "@heroui/react"
import { Link, useRouter } from "@tanstack/react-router"

import { getMediaUrl } from "@/utils/media"
import MaterialSymbolsAddAPhotoRounded from "~icons/material-symbols/add-a-photo-rounded"
import PhSmileyDuotone from "~icons/ph/smiley-duotone"
import PhSmileySadDuotone from "~icons/ph/smiley-sad-duotone"
import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"
import TablerPlayerPlay from "~icons/tabler/player-play"
import TablerTrash from "~icons/tabler/trash"

import { useActivateRoom } from "../../hooks/useRooms"
import { openDeactivateRoomModal } from "../../stores/deactivateRoomModal.store"

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
		case "room": {
			return (
				<Link
					className="flex items-center gap-2 hover:text-primary"
					params={{ roomId: room.id }}
					search={{ tab: "students" }}
					to="/rooms/$roomId"
				>
					<Avatar
						classNames={{
							base: "h-8 w-8 bg-[#1D6FE8] text-white",
							fallback: "text-white",
							icon: "h-full w-full",
							img: "object-cover",
						}}
						fallback={<MaterialSymbolsAddAPhotoRounded className="size-4.5" />}
						name={room.name}
						showFallback
						size="sm"
						src={room.logo ? getMediaUrl(room.logo) : undefined}
					/>
					<span className="font-medium text-sm">{room.name}</span>
				</Link>
			)
		}

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

		case "ratio": {
			const actualRatio = room.staffCount > 0 ? room.studentsCount / room.staffCount : room.studentsCount
			const isGoodRatio = actualRatio <= room.ratio

			return (
				<Tooltip
					closeDelay={0}
					color="primary"
					content={isGoodRatio ? `Ratio is met (1:${room.ratio})` : `Ratio is not met (1:${room.ratio})`}
					delay={300}
				>
					<span className="inline-flex cursor-default items-center justify-center">
						{isGoodRatio ? (
							<PhSmileyDuotone className="size-5 text-success" />
						) : (
							<PhSmileySadDuotone className="size-5 text-danger" />
						)}
					</span>
				</Tooltip>
			)
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
