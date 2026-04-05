import { Avatar, Chip, Label, ListBox, Select, Spinner } from "@heroui/react"
import { useRef, useState } from "react"

import { getMediaUrl } from "@/utils/media"
import OouiUserAvatar from "~icons/ooui/user-avatar"

import { useInfiniteAllEmployees } from "../../hooks/useRooms"
import { handleSelectPopoverScroll } from "../../utils/handleSelectPopoverScroll"

import type { EmployeeOption, StaffMember } from "../../types"

type StaffItem = StaffMember | EmployeeOption

interface StaffSelectProps {
	assignedStaff: StaffItem[]
	onSelectionChange: (staff: StaffItem[], ids: string[]) => void
}

const StaffSelect = ({ assignedStaff, onSelectionChange }: StaffSelectProps) => {
	const [staffDropdownOpened, setStaffDropdownOpened] = useState(false)
	const {
		employees: allEmployees,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteAllEmployees(staffDropdownOpened)
	const loadMoreLockRef = useRef(false)

	const assignedIds = new Set(assignedStaff.map((s) => s.id))
	const staffOptions = [
		...allEmployees,
		...assignedStaff.filter((staff) => !allEmployees.some((e) => e.id === staff.id)),
	].sort((a, b) => {
		const aSelected = assignedIds.has(a.id)
		const bSelected = assignedIds.has(b.id)
		if (aSelected && !bSelected) return -1
		if (!aSelected && bSelected) return 1
		return 0
	})

	const handleChange = (keys: React.Key | React.Key[] | null) => {
		const selectedIds = Array.isArray(keys) ? (keys as string[]) : keys ? [String(keys)] : []
		const selectedStaff = staffOptions.filter((e) => selectedIds.includes(e.id))
		onSelectionChange(selectedStaff, selectedIds)
	}

	return (
		<div className="flex flex-col gap-5">
			<h3 className="font-medium text-xl">Staff</h3>
			<Select
				selectionMode="multiple"
				variant="secondary"
				value={assignedStaff.map((s) => s.id)}
				onChange={handleChange}
				onOpenChange={(open) => {
					if (open) setStaffDropdownOpened(true)
				}}
			>
				<Label>Select Staff</Label>
				<Select.Trigger>
					<Select.Value>
						{({ isPlaceholder, defaultChildren, state }) => {
							if (isPlaceholder || state.selectedItems.length === 0) return defaultChildren
							return state.selectedItems.map((item) => item.textValue).join(", ")
						}}
					</Select.Value>
					<Select.Indicator />
				</Select.Trigger>
				<Select.Popover
					className="max-h-60!"
					onScroll={(e) => {
						handleSelectPopoverScroll(e, hasNextPage ?? false, isFetchingNextPage, loadMoreLockRef, fetchNextPage)
					}}
				>
					<ListBox
						renderEmptyState={() => (
							<div className="flex flex-wrap gap-2 p-2">
								{assignedStaff.map((staff) => (
									<Chip key={staff.id} variant="soft">
										{staff.name}
									</Chip>
								))}
							</div>
						)}
					>
						{staffOptions.map((staff) => (
							<ListBox.Item id={staff.id} key={staff.id} textValue={staff.name}>
								<div className="flex items-center gap-2">
									<Avatar className="size-8">
										<Avatar.Image
											src={
												"avatar" in staff && staff.avatar && staff.avatar !== "/assets/avatars/default.jpg"
													? getMediaUrl(staff.avatar)
													: undefined
											}
											alt={staff.name}
										/>
										<Avatar.Fallback className="bg-accent text-white">
											<OouiUserAvatar className="size-4" />
										</Avatar.Fallback>
									</Avatar>
									<span>{staff.name}</span>
								</div>
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
					{isFetchingNextPage && (
						<div className="flex items-center justify-center gap-2 py-2">
							<Spinner size="sm" />
							<span className="text-muted text-sm">Loading more...</span>
						</div>
					)}
				</Select.Popover>
			</Select>
		</div>
	)
}

export default StaffSelect
