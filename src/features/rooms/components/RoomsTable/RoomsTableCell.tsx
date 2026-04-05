import { Avatar, Button, Dropdown, Label, Tooltip } from "@heroui/react"
import { Link, useRouter } from "@tanstack/react-router"

import { getMediaUrl } from "@/utils/media"
import FluentConferenceRoom20Regular from "~icons/fluent/conference-room-20-regular"
import PhDotsThreeVerticalBold from "~icons/ph/dots-three-vertical-bold"
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
					<Avatar size="sm" className="bg-primary text-primary-foreground">
						<Avatar.Image
							src={room.logo ? getMediaUrl(room.logo) : undefined}
							alt={room.name}
							className="object-cover"
						/>
						<Avatar.Fallback>
							<FluentConferenceRoom20Regular className="size-5" />
						</Avatar.Fallback>
					</Avatar>
					<span className="font-medium text-sm">{room.name}</span>
				</Link>
			)
		}

		case "capacity":
			return <span className="block text-center text-muted text-sm">{room.capacity}</span>

		case "students":
			return <span className="block text-center text-muted text-sm">{room.studentsCount}</span>

		case "staff":
			return <span className="block text-center text-muted text-sm">{room.staffCount}</span>

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
				<Tooltip delay={300}>
					<Tooltip.Trigger aria-label="Ratio status">
						<span className="flex cursor-default items-center justify-center">
							{isGoodRatio ? (
								<PhSmileyDuotone className="size-5 text-success" />
							) : (
								<PhSmileySadDuotone className="size-5 text-danger" />
							)}
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{isGoodRatio ? `Ratio is met (1:${room.ratio})` : `Ratio is not met (1:${room.ratio})`}
					</Tooltip.Content>
				</Tooltip>
			)
		}

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown>
						<Button isIconOnly variant="ghost" aria-label="Room actions">
							<PhDotsThreeVerticalBold aria-hidden className="size-5 text-muted" />
						</Button>
						<Dropdown.Popover>
							<Dropdown.Menu aria-label="Room actions">
								<Dropdown.Item
									id="view"
									textValue="View"
									onAction={() => {
										void router.navigate({
											to: "/rooms/$roomId",
											params: { roomId: room.id },
											search: { tab: "students" },
										})
									}}
								>
									<TablerEye aria-hidden className="size-4 shrink-0 text-success" />
									<Label>View</Label>
								</Dropdown.Item>
								<Dropdown.Item
									id="edit"
									textValue="Edit"
									onAction={() => {
										void router.navigate({
											to: "/rooms/$roomId",
											params: { roomId: room.id },
											search: { tab: "profile" },
										})
									}}
								>
									<TablerEdit aria-hidden className="size-4 shrink-0 text-warning" />
									<Label>Edit</Label>
								</Dropdown.Item>
								{isInactive ? (
									<Dropdown.Item id="activate" textValue="Activate" onAction={() => activateMutation.mutate(room.id)}>
										<TablerPlayerPlay aria-hidden className="size-4 shrink-0 text-muted" />
										<Label>Activate</Label>
									</Dropdown.Item>
								) : (
									<Dropdown.Item
										id="deactivate"
										textValue="Deactivate"
										variant="danger"
										onAction={() => openDeactivateRoomModal(room.id, room.name)}
									>
										<TablerTrash aria-hidden className="size-4 shrink-0 text-danger" />
										<Label>Deactivate</Label>
									</Dropdown.Item>
								)}
							</Dropdown.Menu>
						</Dropdown.Popover>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}

export default RoomsTableCell
