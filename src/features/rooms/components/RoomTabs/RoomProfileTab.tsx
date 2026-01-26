import {
	Avatar,
	Button,
	Card,
	CardBody,
	Chip,
	Input,
	NumberInput,
	Select,
	SelectItem,
	Spinner,
	addToast,
} from "@heroui/react"
import { useInfiniteScroll } from "@heroui/use-infinite-scroll"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"
import { getMediaUrl } from "@/utils/media"
import TablerCheck from "~icons/tabler/check"
import TablerCloudUpload from "~icons/tabler/cloud-upload"
import TablerTrash from "~icons/tabler/trash"

import { ROOM_AGE_OPTIONS } from "../../constants"
import { useInfiniteAllEmployees, useRoom, useUpdateRoom, useUpdateRoomLogo } from "../../hooks/useRooms"
import { roomProfileSchema } from "../../schemas/roomProfile.schema"
import { openDeactivateRoomModal } from "../../stores/deactivateRoomModal.store"
import ImagePickerModal from "../ImagePickerModal"

import type { RoomProfileFormData } from "../../schemas/roomProfile.schema"
import type { EmployeeOption, StaffMember } from "../../types"

// Union type for staff items - can be full StaffMember (from room) or minimal EmployeeOption (from all-employees list)
type StaffItem = StaffMember | EmployeeOption

interface RoomProfileTabProps {
	roomId: string
}

const RoomProfileTab = ({ roomId }: RoomProfileTabProps) => {
	const { data: room, isLoading } = useRoom(roomId)
	const { employees: allEmployees, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteAllEmployees()
	const updateRoomMutation = useUpdateRoom()
	const updateLogoMutation = useUpdateRoomLogo()

	const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
	const [assignedStaff, setAssignedStaff] = useState<StaffItem[]>([])
	const [isStaffSelectOpen, setIsStaffSelectOpen] = useState(false)

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		trigger,
		formState: { errors, isDirty, isValid },
	} = useForm<RoomProfileFormData>({
		resolver: zodResolver(roomProfileSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			capacity: 1,
			ratio: 1,
			minAge: 1,
			maxAge: 1,
			avatarFile: null,
			avatarPreview: null,
			staffIds: [],
		},
	})

	const avatarPreview = watch("avatarPreview")
	const avatarFile = watch("avatarFile")

	// Sync form state when room data loads
	useEffect(() => {
		if (room) {
			const preview = room.color ?? (room.logo ? getMediaUrl(room.logo) : null)
			reset({
				name: room.name,
				capacity: room.capacity,
				ratio: room.ratio,
				minAge: room.minAge,
				maxAge: room.maxAge,
				avatarFile: null,
				avatarPreview: preview,
				staffIds: room.signedInStaff.map((s) => s.id),
			})
			setAssignedStaff(room.signedInStaff)
		}
	}, [room, reset])

	// Merge allEmployees with assignedStaff and sort selected staff to the top
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

	// Infinite scroll for staff list - enabled when Select dropdown is open
	const [, staffScrollerRef] = useInfiniteScroll({
		hasMore: hasNextPage ?? false,
		isEnabled: isStaffSelectOpen,
		shouldUseLoader: false,
		onLoadMore: fetchNextPage,
	})

	const handleStaffSelectionChange = (keys: "all" | Set<React.Key>) => {
		if (keys === "all") {
			setAssignedStaff(staffOptions)
			setValue(
				"staffIds",
				staffOptions.map((s) => s.id),
				{ shouldDirty: true },
			)
		} else {
			const selectedIds = Array.from(keys) as string[]
			const selectedStaff = staffOptions.filter((e) => selectedIds.includes(e.id))
			setAssignedStaff(selectedStaff)
			setValue("staffIds", selectedIds, { shouldDirty: true })
		}
	}

	const handleImageSelect = (image: string | File) => {
		if (typeof image === "string") {
			// Gradient color
			setValue("avatarPreview", image, { shouldDirty: true })
			setValue("avatarFile", null, { shouldDirty: true })
		} else {
			// File upload
			const previewUrl = URL.createObjectURL(image)
			setValue("avatarPreview", previewUrl, { shouldDirty: true })
			setValue("avatarFile", image, { shouldDirty: true })
		}
	}

	const handleDeletePicture = () => {
		setValue("avatarPreview", null, { shouldDirty: true })
		setValue("avatarFile", null, { shouldDirty: true })
	}

	const handleCancel = () => {
		// Reset to original values
		if (room) {
			const preview = room.color ?? (room.logo ? getMediaUrl(room.logo) : null)
			reset({
				name: room.name,
				capacity: room.capacity,
				ratio: room.ratio,
				minAge: room.minAge,
				maxAge: room.maxAge,
				avatarFile: null,
				avatarPreview: preview,
				staffIds: room.signedInStaff.map((s) => s.id),
			})
			setAssignedStaff(room.signedInStaff)
		}
	}

	const onSubmit = (data: RoomProfileFormData) => {
		const isGradient = data.avatarPreview?.startsWith("linear-gradient")

		updateRoomMutation.mutate(
			{
				roomId,
				payload: {
					title: data.name,
					capacity: data.capacity,
					ratio: data.ratio,
					minAge: data.minAge,
					maxAge: data.maxAge,
					employeeIds: data.staffIds,
					...(isGradient && data.avatarPreview && { color: data.avatarPreview }),
				},
			},
			{
				onSuccess: () => {
					// If there's a new logo file, upload it
					if (data.avatarFile) {
						updateLogoMutation.mutate(
							{ roomId, logoFile: data.avatarFile },
							{
								onSuccess: () => {
									setValue("avatarFile", null)
									addToast({
										title: "Room updated",
										description: "Room details have been saved successfully.",
										color: "success",
									})
								},
								onError: (error) => {
									addToast({
										title: "Room updated but logo upload failed",
										description: getErrorMessage(error),
										color: "warning",
									})
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
						description: getErrorMessage(error),
						color: "danger",
					})
				},
			},
		)
	}

	const isSaving = updateRoomMutation.isPending || updateLogoMutation.isPending

	// Check if any changes were made (use isDirty from form + check avatarFile separately)
	const hasChanges = isDirty || !!avatarFile

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
				<form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div className="flex flex-col gap-5">
							<h3 className="font-medium text-xl">Room Info</h3>
							<div className="grid grid-cols-2 gap-2">
								<Controller
									control={control}
									name="name"
									render={({ field }) => (
										<Input
											{...field}
											className="col-span-2"
											errorMessage={errors.name?.message}
											isInvalid={!!errors.name}
											isRequired
											label="Room Name"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="minAge"
									render={({ field }) => (
										<Select
											errorMessage={errors.minAge?.message}
											isInvalid={!!errors.minAge}
											isRequired
											label="Min age"
											labelPlacement="inside"
											onSelectionChange={(keys) => {
												const selected = Array.from(keys)[0]
												if (selected !== undefined) {
													field.onChange(Number(selected))
													// Re-validate to clear error if fixed
													trigger("minAge")
												}
											}}
											radius="md"
											selectedKeys={field.value !== undefined ? [String(field.value)] : []}
											variant="flat"
										>
											{ROOM_AGE_OPTIONS.map((option) => (
												<SelectItem key={option.key}>{option.label}</SelectItem>
											))}
										</Select>
									)}
								/>
								<Controller
									control={control}
									name="maxAge"
									render={({ field }) => (
										<Select
											errorMessage={errors.maxAge?.message}
											isInvalid={!!errors.maxAge}
											isRequired
											label="Max age"
											labelPlacement="inside"
											onSelectionChange={(keys) => {
												const selected = Array.from(keys)[0]
												if (selected !== undefined) {
													field.onChange(Number(selected))
													// Re-validate to clear error if fixed
													trigger("minAge")
												}
											}}
											radius="md"
											selectedKeys={field.value !== undefined ? [String(field.value)] : []}
											variant="flat"
										>
											{ROOM_AGE_OPTIONS.map((option) => (
												<SelectItem key={option.key}>{option.label}</SelectItem>
											))}
										</Select>
									)}
								/>
								<Controller
									control={control}
									name="capacity"
									render={({ field }) => (
										<NumberInput
											errorMessage={errors.capacity?.message}
											formatOptions={{ useGrouping: false }}
											isInvalid={!!errors.capacity}
											isRequired
											label="Max capacity"
											labelPlacement="inside"
											minValue={1}
											onValueChange={(value) => field.onChange(value ?? 1)}
											radius="md"
											value={field.value}
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="ratio"
									render={({ field }) => (
										<NumberInput
											errorMessage={errors.ratio?.message}
											formatOptions={{ useGrouping: false }}
											isInvalid={!!errors.ratio}
											isRequired
											label="Students per 1 staff"
											labelPlacement="inside"
											minValue={1}
											onValueChange={(value) => field.onChange(value ?? 1)}
											radius="md"
											value={field.value}
											variant="flat"
										/>
									)}
								/>
							</div>
						</div>

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
										endContent={<TablerCloudUpload className="size-5" />}
										onPress={() => setIsImagePickerOpen(true)}
										radius="md"
										size="sm"
									>
										Upload Picture
									</Button>
									<Button
										color="danger"
										endContent={<TablerTrash className="size-5" />}
										onPress={handleDeletePicture}
										radius="md"
										size="sm"
									>
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
							<h3 className="font-medium text-xl">Staff</h3>
							<Select
								isLoading={isFetchingNextPage}
								isMultiline
								items={staffOptions}
								label="Select Staff"
								labelPlacement="inside"
								maxListboxHeight={256}
								onOpenChange={setIsStaffSelectOpen}
								onSelectionChange={handleStaffSelectionChange}
								placeholder="Select staff to add"
								radius="md"
								scrollRef={staffScrollerRef}
								renderValue={(items) => (
									<div className="flex flex-wrap gap-2">
										{items.map((item) => (
											<Chip
												avatar={
													<Avatar
														name={item.data?.name}
														showFallback
														size="sm"
														src={"avatar" in (item.data ?? {}) ? (item.data as StaffMember).avatar : undefined}
													/>
												}
												classNames={{
													base: "bg-primary-50 h-7",
													content: "text-sm",
												}}
												key={item.key}
												onClose={() => {
													const newStaff = assignedStaff.filter((s) => s.id !== item.key)
													setAssignedStaff(newStaff)
													setValue(
														"staffIds",
														newStaff.map((s) => s.id),
														{ shouldDirty: true },
													)
												}}
												variant="flat"
											>
												{item.data?.name}
											</Chip>
										))}
									</div>
								)}
								selectedKeys={new Set(assignedStaff.map((s) => s.id))}
								selectionMode="multiple"
								variant="flat"
							>
								{(staff) => (
									<SelectItem key={staff.id} textValue={staff.name}>
										<div className="flex items-center gap-2">
											<Avatar
												name={staff.name}
												showFallback
												size="sm"
												src={"avatar" in staff ? staff.avatar : undefined}
											/>
											<span>{staff.name}</span>
										</div>
									</SelectItem>
								)}
							</Select>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<Button
							color="danger"
							endContent={<TablerTrash className="size-5" />}
							isDisabled={isSaving}
							onPress={() => openDeactivateRoomModal(roomId, room.name)}
							radius="md"
							size="md"
							type="button"
						>
							Deactivate Room
						</Button>
						<div className="flex gap-5">
							<Button
								isDisabled={isSaving}
								onPress={handleCancel}
								radius="md"
								size="md"
								type="button"
								variant="bordered"
							>
								Cancel
							</Button>
							<Button
								color="primary"
								endContent={!isSaving && <TablerCheck className="size-5" />}
								isDisabled={!hasChanges || !isValid}
								isLoading={isSaving}
								radius="md"
								size="md"
								type="submit"
							>
								Save Changes
							</Button>
						</div>
					</div>
				</form>
			</CardBody>
		</Card>
	)
}

export default RoomProfileTab
