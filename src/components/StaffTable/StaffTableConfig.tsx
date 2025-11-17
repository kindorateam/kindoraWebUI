import { Avatar, Button, Chip } from "@heroui/react"

import RoomIcon from "@/features/rooms/components/RoomIcon"

import type { Staff } from "@/types/staff"
import type { TableColumn } from "@/types/table"

interface StaffTableCellProps {
	staff: Staff
	isPinVisible: (id: string) => boolean
	togglePinVisibility: (id: string) => void
}

const createStaffColumns = ({
	isPinVisible,
	togglePinVisibility,
}: Omit<StaffTableCellProps, "staff">): TableColumn<Staff>[] => [
	{
		key: "staff",
		label: "Staff",
		renderCell: (staff) => (
			<div className="flex items-center gap-3">
				<Avatar alt={staff.name} className="h-10 w-10" showFallback src={staff.avatar} />
				<div className="flex flex-col">
					<span className="font-medium text-sm">{staff.name}</span>
					{staff.isCurrentUser && <span className="text-green-500 text-xs">My account</span>}
				</div>
			</div>
		),
	},
	{
		key: "role",
		label: "Role",
		renderCell: (staff) => <span className="text-xs">{staff.role}</span>,
	},
	{
		key: "email",
		label: "Email",
		renderCell: (staff) => <span className="text-text-secondary text-xs">{staff.email}</span>,
	},
	{
		key: "rooms",
		label: "Rooms",
		renderCell: () => (
			<div className="flex items-center gap-2 text-text-secondary">
				<RoomIcon roomType="turtle" />
				<span className="text-xs">Baby turtles</span>
			</div>
		),
	},
	{
		key: "pin",
		label: "Pin",
		renderCell: (staff) => {
			const isVisible = isPinVisible(staff.id)

			if (staff.isCurrentUser) {
				return (
					<Chip
						className="bg-gray-100 p-0! text-gray-800"
						classNames={{
							base: "p-0!",
							content: "p-0!",
						}}
						size="sm"
					>
						{staff.pin}
					</Chip>
				)
			}

			return isVisible ? (
				<Chip
					className="cursor-pointer bg-gray-100 p-0! text-gray-800"
					classNames={{
						base: "p-0!",
						content: "p-0!",
					}}
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
			)
		},
	},
]

export default createStaffColumns
