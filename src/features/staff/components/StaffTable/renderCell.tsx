import { Avatar, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"

import RoomIcon from "@/features/rooms/components/RoomIcon"
import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"
import TablerTrash from "~icons/tabler/trash"

import type { Staff } from "../../types"

interface RenderCellOptions {
	isPinVisible: (id: string) => boolean
	togglePinVisibility: (id: string) => void
}

export function renderCell(staff: Staff, columnKey: React.Key, options: RenderCellOptions) {
	const { isPinVisible, togglePinVisibility } = options

	switch (columnKey) {
		case "staff":
			return (
				<div className="flex items-center gap-3">
					<Avatar alt={staff.name} showFallback size="sm" src={staff.avatar} />
					<div className="flex flex-col">
						<span className="font-medium text-sm">{staff.name}</span>
						{staff.isCurrentUser && <span className="text-green-500 text-xs">My account</span>}
					</div>
				</div>
			)

		case "role":
			return <span className="text-gray-600 text-sm">{staff.role}</span>

		case "email":
			return <span className="text-gray-500 text-sm">{staff.email}</span>

		case "rooms":
			return (
				<div className="flex items-center gap-2">
					<RoomIcon roomType="turtle" />
					<span className="text-gray-600 text-sm">{staff.rooms[0] || "No room"}</span>
				</div>
			)

		case "pin": {
			const isVisible = isPinVisible(staff.id)

			if (staff.isCurrentUser) {
				return (
					<div className="flex justify-center">
						<Chip className="bg-gray-100 text-gray-800" size="sm">
							{staff.pin}
						</Chip>
					</div>
				)
			}

			return (
				<div className="flex justify-center">
					{isVisible ? (
						<Chip
							className="cursor-pointer bg-gray-100 text-gray-800"
							onClick={() => togglePinVisibility(staff.id)}
							size="sm"
						>
							{staff.pin}
						</Chip>
					) : (
						<Button
							className="bg-[#792C4133] font-semibold text-[11px] text-brand"
							onPress={() => togglePinVisibility(staff.id)}
							size="sm"
						>
							Reveal
						</Button>
					)}
				</div>
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
						<DropdownMenu aria-label="Staff actions">
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
