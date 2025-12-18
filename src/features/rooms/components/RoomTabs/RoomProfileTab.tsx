import { Avatar, Button, Card, CardBody, Chip, Input, Select, SelectItem } from "@heroui/react"
import { useState } from "react"

import { useRoom } from "../../hooks/useRooms"
import { openDeactivateRoomModal } from "../../stores/deactivateRoomModal.store"
import ImagePickerModal from "../ImagePickerModal"

interface RoomProfileTabProps {
	roomId: string
}

// Mock data - will be replaced with API data later
const mockRoomData = {
	name: "Baby Turtles",
	minAge: "2 years",
	maxAge: "4 years",
	maxCapacity: "20",
	studentsPerStaff: "10",
	avatarUrl: "",
}

const mockStaff = [
	{ id: "1", name: "James Whitaker" },
	{ id: "2", name: "James Whitaker" },
	{ id: "3", name: "James Whitaker" },
	{ id: "4", name: "James Whitaker" },
]

const availableStaff = [
	{ id: "5", name: "Emily Carter" },
	{ id: "6", name: "Michael Brown" },
	{ id: "7", name: "Sarah Johnson" },
]

const UploadIcon = () => (
	<svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
		<path
			d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

const TrashIcon = () => (
	<svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
		<path
			d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

const SaveIcon = () => (
	<svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
		<path
			clipRule="evenodd"
			d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
			fillRule="evenodd"
		/>
	</svg>
)

const RoomProfileTab = ({ roomId }: RoomProfileTabProps) => {
	const { data: room } = useRoom(roomId)
	const [assignedStaff, setAssignedStaff] = useState(mockStaff)
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)

	const handleRemoveStaff = (staffId: string) => {
		setAssignedStaff((prev) => prev.filter((s) => s.id !== staffId))
	}

	const handleImageSelect = (image: string | File) => {
		if (typeof image === "string") {
			// It's a gradient
			setAvatarPreview(image)
		} else {
			// It's a file
			const previewUrl = URL.createObjectURL(image)
			setAvatarPreview(previewUrl)
		}
	}

	const handleDeletePicture = () => {
		setAvatarPreview(null)
	}

	return (
		<Card>
			<CardBody className="gap-8 p-5 md:p-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					<div className="flex flex-col gap-5">
						<h3 className="font-medium text-xl">Profile Picture</h3>
						<div className="flex items-center gap-5">
							<div>
								{avatarPreview?.startsWith("linear-gradient") ? (
									<div className="size-25 rounded-full shadow-md" style={{ background: avatarPreview }} />
								) : (
									<Avatar className="size-25 shadow-md" showFallback src={avatarPreview || mockRoomData.avatarUrl} />
								)}
							</div>
							<div className="flex gap-5">
								<Button
									color="primary"
									endContent={<UploadIcon />}
									onPress={() => setIsImagePickerOpen(true)}
									radius="md"
									size="sm"
								>
									Upload Picture
								</Button>
								<Button color="danger" endContent={<TrashIcon />} onPress={handleDeletePicture} radius="md" size="sm">
									Delete Picture
								</Button>
							</div>
						</div>
						<ImagePickerModal
							isOpen={isImagePickerOpen}
							onClose={() => setIsImagePickerOpen(false)}
							onSelect={handleImageSelect}
						/>
					</div>

					<div className="flex flex-col gap-5">
						<h3 className="font-medium text-xl">Room Info</h3>
						<div className="grid grid-cols-2 gap-2">
							<Input
								className="col-span-2"
								defaultValue={mockRoomData.name}
								label="Room Name"
								labelPlacement="inside"
								radius="md"
								variant="flat"
							/>
							<Input
								defaultValue={mockRoomData.minAge}
								label="Min age"
								labelPlacement="inside"
								radius="md"
								variant="flat"
							/>
							<Input
								defaultValue={mockRoomData.maxAge}
								label="Max age"
								labelPlacement="inside"
								radius="md"
								variant="flat"
							/>
							<Input
								defaultValue={mockRoomData.maxCapacity}
								label="Max capacity"
								labelPlacement="inside"
								radius="md"
								variant="flat"
							/>
							<Input
								defaultValue={mockRoomData.studentsPerStaff}
								label="Students per 1 staff"
								labelPlacement="inside"
								radius="md"
								variant="flat"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-5">
						<h3 className="font-medium text-xl">Staff</h3>
						<div className="flex flex-wrap gap-3">
							{assignedStaff.map((staff) => (
								<Chip
									avatar={<Avatar name={staff.name} size="sm" />}
									classNames={{
										base: "bg-primary-50 h-8 px-3",
										content: "text-sm",
									}}
									key={staff.id}
									onClose={() => handleRemoveStaff(staff.id)}
									variant="flat"
								>
									{staff.name}
								</Chip>
							))}
						</div>
						<Select label="Select Staff" labelPlacement="inside" radius="md" variant="flat">
							{availableStaff.map((staff) => (
								<SelectItem key={staff.id}>{staff.name}</SelectItem>
							))}
						</Select>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<Button
						color="danger"
						endContent={<TrashIcon />}
						onPress={() => openDeactivateRoomModal(roomId, room?.name ?? "this room")}
						radius="md"
						size="md"
					>
						Deactivate Room
					</Button>
					<div className="flex gap-5">
						<Button radius="md" size="md" variant="bordered">
							Cancel
						</Button>
						<Button color="primary" endContent={<SaveIcon />} radius="md" size="md">
							Save Changes
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default RoomProfileTab
