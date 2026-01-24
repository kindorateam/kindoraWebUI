import { Avatar, Button, Card, CardBody, Chip, Input, Select, SelectItem, Spinner, addToast } from "@heroui/react"
import { useEffect, useState } from "react"

import { getMediaUrl } from "@/utils/media"

import { ROOM_AGE_OPTIONS } from "../../constants"
import { useAllEmployees, useRoom, useUpdateRoom, useUpdateRoomLogo } from "../../hooks/useRooms"
import { openDeactivateRoomModal } from "../../stores/deactivateRoomModal.store"
import ImagePickerModal from "../ImagePickerModal"

import type { StaffMember } from "../../types"

interface RoomProfileTabProps {
	roomId: string
}

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
	const { data: room, isLoading } = useRoom(roomId)
	const { data: allEmployees = [] } = useAllEmployees()
	const updateRoomMutation = useUpdateRoom()
	const updateLogoMutation = useUpdateRoomLogo()

	// Form state
	const [name, setName] = useState("")
	const [capacity, setCapacity] = useState("")
	const [ratio, setRatio] = useState("")
	const [minAge, setMinAge] = useState("")
	const [maxAge, setMaxAge] = useState("")
	const [assignedStaff, setAssignedStaff] = useState<StaffMember[]>([])
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)

	// Sync form state when room data loads
	useEffect(() => {
		if (room) {
			setName(room.name)
			setCapacity(String(room.capacity))
			setRatio(String(room.ratio))
			setMinAge(String(room.minAge))
			setMaxAge(String(room.maxAge))
			setAssignedStaff(room.signedInStaff)
			if (room.color) {
				setAvatarPreview(room.color)
			} else if (room.logo) {
				setAvatarPreview(getMediaUrl(room.logo))
			}
		}
	}, [room])

	// Filter out already assigned staff from available options
	const availableStaff = allEmployees.filter((employee) => !assignedStaff.some((staff) => staff.id === employee.id))

	const handleRemoveStaff = (staffId: string) => {
		setAssignedStaff((prev) => prev.filter((s) => s.id !== staffId))
	}

	const handleAddStaff = (staffId: string) => {
		const staffToAdd = allEmployees.find((e) => e.id === staffId)
		if (staffToAdd) {
			setAssignedStaff((prev) => [...prev, staffToAdd])
		}
	}

	const handleImageSelect = (image: string | File) => {
		if (typeof image === "string") {
			// Gradient color
			setAvatarPreview(image)
			setAvatarFile(null)
		} else {
			// File upload
			const previewUrl = URL.createObjectURL(image)
			setAvatarPreview(previewUrl)
			setAvatarFile(image)
		}
	}

	const handleDeletePicture = () => {
		setAvatarPreview(null)
		setAvatarFile(null)
	}

	const handleCancel = () => {
		// Reset to original values
		if (room) {
			setName(room.name)
			setCapacity(String(room.capacity))
			setRatio(String(room.ratio))
			setMinAge(String(room.minAge))
			setMaxAge(String(room.maxAge))
			setAssignedStaff(room.signedInStaff)
			setAvatarFile(null)
			if (room.color) {
				setAvatarPreview(room.color)
			} else if (room.logo) {
				setAvatarPreview(getMediaUrl(room.logo))
			} else {
				setAvatarPreview(null)
			}
		}
	}

	const handleSave = () => {
		const isGradient = avatarPreview?.startsWith("linear-gradient")

		updateRoomMutation.mutate(
			{
				roomId,
				payload: {
					title: name,
					capacity: Number(capacity),
					ratio: Number(ratio),
					minAge: Number(minAge),
					maxAge: Number(maxAge),
					employeeIds: assignedStaff.map((s) => s.id),
					...(isGradient && avatarPreview && { color: avatarPreview }),
				},
			},
			{
				onSuccess: () => {
					// If there's a new logo file, upload it
					if (avatarFile) {
						updateLogoMutation.mutate(
							{ roomId, logoFile: avatarFile },
							{
								onSuccess: () => {
									setAvatarFile(null)
									addToast({
										title: "Room updated",
										description: "Room details have been saved successfully.",
										color: "success",
									})
								},
								onError: (error) => {
									addToast({
										title: "Room updated but logo upload failed",
										description: "You can try uploading the logo again.",
										color: "warning",
									})
									console.error("Failed to upload logo:", error)
								},
							},
						)
					} else {
						addToast({
							title: "Room updated",
							description: "Room details have been saved successfully.",
							color: "success",
						})
					}
				},
				onError: (error) => {
					addToast({
						title: "Failed to update room",
						description: "Please try again.",
						color: "danger",
					})
					console.error("Failed to update room:", error)
				},
			},
		)
	}

	const isSaving = updateRoomMutation.isPending || updateLogoMutation.isPending

	if (isLoading) {
		return (
			<Card>
				<CardBody className="flex h-96 items-center justify-center">
					<Spinner size="lg" />
				</CardBody>
			</Card>
		)
	}

	if (!room) {
		return (
			<Card>
				<CardBody className="flex h-96 items-center justify-center">
					<p className="text-default-500">Room not found</p>
				</CardBody>
			</Card>
		)
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
									<Avatar
										className="size-25 shadow-md"
										name={room.name}
										showFallback
										src={avatarPreview ?? undefined}
									/>
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
								label="Room Name"
								labelPlacement="inside"
								onValueChange={setName}
								radius="md"
								value={name}
								variant="flat"
							/>
							<Select
								label="Min age"
								labelPlacement="inside"
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0]
									if (selected !== undefined) setMinAge(String(selected))
								}}
								radius="md"
								selectedKeys={minAge ? [minAge] : []}
								variant="flat"
							>
								{ROOM_AGE_OPTIONS.map((option) => (
									<SelectItem key={option.key}>{option.label}</SelectItem>
								))}
							</Select>
							<Select
								label="Max age"
								labelPlacement="inside"
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0]
									if (selected !== undefined) setMaxAge(String(selected))
								}}
								radius="md"
								selectedKeys={maxAge ? [maxAge] : []}
								variant="flat"
							>
								{ROOM_AGE_OPTIONS.map((option) => (
									<SelectItem key={option.key}>{option.label}</SelectItem>
								))}
							</Select>
							<Input
								label="Max capacity"
								labelPlacement="inside"
								onValueChange={setCapacity}
								radius="md"
								type="number"
								value={capacity}
								variant="flat"
							/>
							<Input
								label="Students per 1 staff"
								labelPlacement="inside"
								onValueChange={setRatio}
								radius="md"
								type="number"
								value={ratio}
								variant="flat"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-5">
						<h3 className="font-medium text-xl">Staff</h3>
						<div className="flex flex-wrap gap-3">
							{assignedStaff.length === 0 ? (
								<p className="text-default-400 text-sm">No staff assigned</p>
							) : (
								assignedStaff.map((staff) => (
									<Chip
										avatar={<Avatar name={staff.name} showFallback size="sm" src={staff.avatar} />}
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
								))
							)}
						</div>
						<Select
							label="Select Staff"
							labelPlacement="inside"
							radius="md"
							variant="flat"
							isDisabled={availableStaff.length === 0}
							placeholder={availableStaff.length === 0 ? "No available staff" : "Select staff to add"}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0]
								if (selected) handleAddStaff(String(selected))
							}}
							selectedKeys={[]}
						>
							{availableStaff.map((staff) => (
								<SelectItem key={staff.id} textValue={staff.name}>
									<div className="flex items-center gap-2">
										<Avatar name={staff.name} showFallback size="sm" src={staff.avatar} />
										<span>{staff.name}</span>
									</div>
								</SelectItem>
							))}
						</Select>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<Button
						color="danger"
						endContent={<TrashIcon />}
						isDisabled={isSaving}
						onPress={() => openDeactivateRoomModal(roomId, room.name)}
						radius="md"
						size="md"
					>
						Deactivate Room
					</Button>
					<div className="flex gap-5">
						<Button isDisabled={isSaving} onPress={handleCancel} radius="md" size="md" variant="bordered">
							Cancel
						</Button>
						<Button
							color="primary"
							endContent={!isSaving && <SaveIcon />}
							isLoading={isSaving}
							onPress={handleSave}
							radius="md"
							size="md"
						>
							Save Changes
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default RoomProfileTab
