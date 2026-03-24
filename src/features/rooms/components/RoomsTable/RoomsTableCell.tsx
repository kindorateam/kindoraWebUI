import { Avatar, Button, Dropdown, Label, Tooltip } from "@heroui/react"
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
					<Avatar className="h-8 w-8 bg-[#1D6FE8] text-white">
						<Avatar.Image
							src={room.logo ? getMediaUrl(room.logo) : undefined}
							alt={room.name}
							className="object-cover"
						/>
						<Avatar.Fallback className="text-white">
							<MaterialSymbolsAddAPhotoRounded className="size-4.5" />
						</Avatar.Fallback>
					</Avatar>
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
				<Tooltip closeDelay={0} color="primary" delay={300}>
					<span className="inline-flex cursor-default items-center justify-center">
						{isGoodRatio ? (
							<PhSmileyDuotone className="size-5 text-success" />
						) : (
							<PhSmileySadDuotone className="size-5 text-danger" />
						)}
					</span>
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
						<Dropdown.Trigger>
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
						</Dropdown.Trigger>
						<Dropdown.Popover>
							<Dropdown.Menu aria-label="Room actions">
								<Dropdown.Item
									id="view"
									textValue="View"
									className="text-success"
									onAction={() => {
										void router.navigate({
											to: "/rooms/$roomId",
											params: { roomId: room.id },
											search: { tab: "students" },
										})
									}}
								>
									<Label>
										<TablerEye aria-hidden className="size-5" />
										View
									</Label>
								</Dropdown.Item>
								<Dropdown.Item
									id="edit"
									textValue="Edit"
									className="text-warning"
									onAction={() => {
										void router.navigate({
											to: "/rooms/$roomId",
											params: { roomId: room.id },
											search: { tab: "profile" },
										})
									}}
								>
									<Label>
										<TablerEdit aria-hidden className="size-5" />
										Edit
									</Label>
								</Dropdown.Item>
								{isInactive ? (
									<Dropdown.Item
										id="activate"
										textValue="Activate"
										className="text-success"
										onAction={() => activateMutation.mutate(room.id)}
									>
										<Label>
											<TablerPlayerPlay aria-hidden className="size-5" />
											Activate
										</Label>
									</Dropdown.Item>
								) : (
									<Dropdown.Item
										id="deactivate"
										textValue="Deactivate"
										className="text-danger"
										onAction={() => openDeactivateRoomModal(room.id, room.name)}
									>
										<Label>
											<TablerTrash aria-hidden className="size-5" />
											Deactivate
										</Label>
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
