import { Avatar, Button, Dropdown, Label, Tooltip } from "@heroui/react"
import { Link, useRouter } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

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
	const { t } = useTranslation()
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
			return <SignedInAvatarGroup items={checkedInStudents} tooltipLabel={t("rooms.table.signedInStudents")} />
		}

		case "signInStaff": {
			const checkedInStaff = room.signedInStaff.filter((staff) => staff.checkedIn)
			return <SignedInAvatarGroup items={checkedInStaff} tooltipLabel={t("rooms.table.signedInStaff")} />
		}

		case "ratio": {
			const actualRatio = room.staffCount > 0 ? room.studentsCount / room.staffCount : room.studentsCount
			const isGoodRatio = actualRatio <= room.ratio

			return (
				<Tooltip delay={0}>
					<Tooltip.Trigger aria-label={t("rooms.table.ratioStatus")}>
						<span className="flex cursor-default items-center justify-center">
							{isGoodRatio ? (
								<PhSmileyDuotone className="size-5 text-success" />
							) : (
								<PhSmileySadDuotone className="size-5 text-danger" />
							)}
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{t(isGoodRatio ? "rooms.detail.ratioMet" : "rooms.detail.ratioNotMet", { ratio: room.ratio })}
					</Tooltip.Content>
				</Tooltip>
			)
		}

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown>
						<Button isIconOnly variant="ghost" aria-label={t("rooms.table.actions.ariaLabel")}>
							<PhDotsThreeVerticalBold aria-hidden className="size-5 text-muted" />
						</Button>
						<Dropdown.Popover>
							<Dropdown.Menu aria-label={t("rooms.table.actions.ariaLabel")}>
								<Dropdown.Item
									id="view"
									textValue={t("rooms.table.actions.view")}
									onAction={() => {
										void router.navigate({
											to: "/rooms/$roomId",
											params: { roomId: room.id },
											search: { tab: "students" },
										})
									}}
								>
									<TablerEye aria-hidden className="size-4 shrink-0 text-success" />
									<Label>{t("rooms.table.actions.view")}</Label>
								</Dropdown.Item>
								<Dropdown.Item
									id="edit"
									textValue={t("rooms.table.actions.edit")}
									onAction={() => {
										void router.navigate({
											to: "/rooms/$roomId",
											params: { roomId: room.id },
											search: { tab: "profile" },
										})
									}}
								>
									<TablerEdit aria-hidden className="size-4 shrink-0 text-warning" />
									<Label>{t("rooms.table.actions.edit")}</Label>
								</Dropdown.Item>
								{isInactive ? (
									<Dropdown.Item
										id="activate"
										textValue={t("rooms.table.actions.activate")}
										onAction={() => activateMutation.mutate(room.id)}
									>
										<TablerPlayerPlay aria-hidden className="size-4 shrink-0 text-muted" />
										<Label>{t("rooms.table.actions.activate")}</Label>
									</Dropdown.Item>
								) : (
									<Dropdown.Item
										id="deactivate"
										textValue={t("rooms.table.actions.deactivate")}
										variant="danger"
										onAction={() => openDeactivateRoomModal(room.id, room.name)}
									>
										<TablerTrash aria-hidden className="size-4 shrink-0 text-danger" />
										<Label>{t("rooms.table.actions.deactivate")}</Label>
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
