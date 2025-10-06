import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"
import { useSetAtom } from "jotai"
import { useState } from "react"

import { openAddRoomDrawerAtom } from "@/stores/addRoomDrawer.store"

import Button from "./Button"
import AddRoomDrawer, { type AddRoomFormData } from "./drawers/AddRoomDrawer"
import CalendarPlusIcon from "./icons/CalendarPlusIcon"
import PlusIcon from "./icons/PlusIcon"
import RoomIcon from "./icons/RoomIcon"
import StaffIcon from "./icons/StaffIcon"
import StudentIcon from "./icons/StudentIcon"

interface FABProps {
	onAddStudent?: () => void
	onAddRoom?: () => void
	onAddStaff?: () => void
	onAddActivity?: () => void
	onAddEvent?: () => void
}

const FAB = ({ onAddStudent, onAddRoom, onAddStaff, onAddActivity, onAddEvent }: FABProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const openAddRoomDrawer = useSetAtom(openAddRoomDrawerAtom)

	const handleAction = (key: string) => {
		setIsOpen(false)
		switch (key) {
			case "student":
				onAddStudent?.()
				break
			case "room":
				openAddRoomDrawer()
				onAddRoom?.()
				break
			case "staff":
				onAddStaff?.()
				break
			case "activity":
				onAddActivity?.()
				break
			case "event":
				onAddEvent?.()
				break
		}
	}

	const handleRoomSubmit = async (data: AddRoomFormData) => {
		console.log("Room data:", data)
		// API call will be implemented later
		// For now, just simulate success
	}

	return (
		<>
			<div className="absolute top-[110px] right-[-25px] z-50">
				<Dropdown className="min-w-[175px] p-0" isOpen={isOpen} placement="bottom-start" onOpenChange={setIsOpen}>
					<DropdownTrigger>
						<Button color="primary" className="h-12 w-12 min-w-0 rounded-full p-0">
							<PlusIcon />
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="Add actions"
						classNames={{
							base: "p-3.5",
						}}
						itemClasses={{
							base: "py-2.5 px-4 gap-2.5 data-[hover=true]:bg-brand/5 data-[hover=true]:text-brand data-[pressed=true]:bg-brand/20 data-[pressed=true]:text-brand data-[focus=true]:bg-brand/5 data-[focus=true]:text-brand data-[focus-visible=true]:bg-brand/5 data-[focus-visible=true]:text-brand min-w-0! [&_svg]:fill-current",
						}}
						onAction={(key) => handleAction(key as string)}
					>
						<DropdownItem key="student" startContent={<StudentIcon className="h-4 w-4" />}>
							Add Student
						</DropdownItem>
						<DropdownItem key="room" startContent={<RoomIcon className="h-4 w-4" />}>
							Add Room
						</DropdownItem>
						<DropdownItem key="staff" startContent={<StaffIcon className="h-4 w-4" />}>
							Add Staff
						</DropdownItem>
						<DropdownItem key="activity" startContent={<CalendarPlusIcon className="h-4 w-4" />}>
							Add Activity
						</DropdownItem>
						<DropdownItem key="event" startContent={<CalendarPlusIcon className="h-4 w-4" />}>
							Add Event
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>

			<AddRoomDrawer onSubmit={handleRoomSubmit} />
		</>
	)
}

export default FAB
