import {
	Avatar,
	Button,
	Card,
	Chip,
	FieldError,
	Input,
	Label,
	ListBox,
	NumberField,
	Select,
	Spinner,
	TextField,
	toast,
} from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"
import { getMediaUrl } from "@/utils/media"
import MaterialSymbolsAddAPhotoRounded from "~icons/material-symbols/add-a-photo-rounded"
import OouiUserAvatar from "~icons/ooui/user-avatar"

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
			// Trigger validation after reset to update isValid state
			void trigger()
		}
	}, [room, reset, trigger])

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

	// IntersectionObserver-based infinite scroll for staff list
	const staffObserverRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!staffObserverRef.current || !hasNextPage || isFetchingNextPage) return
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]
				if (entry?.isIntersecting) fetchNextPage()
			},
			{ threshold: 0.5 },
		)
		observer.observe(staffObserverRef.current)
		return () => observer.disconnect()
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	const handleStaffSelectionChange = (keys: React.Key | React.Key[] | null) => {
		const selectedIds = Array.isArray(keys) ? (keys as string[]) : keys ? [String(keys)] : []
		const selectedStaff = staffOptions.filter((e) => selectedIds.includes(e.id))
		setAssignedStaff(selectedStaff)
		setValue("staffIds", selectedIds, { shouldDirty: true })
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
									toast("Room updated", {
										description: "Room details have been saved successfully.",
										variant: "success",
									})
								},
								onError: (error) => {
									toast("Room updated but logo upload failed", {
										description: getErrorMessage(error),
										variant: "warning",
									})
								},
							},
						)
					} else {
						toast("Room updated", {
							description: "Room details have been saved successfully.",
							variant: "success",
						})
					}
				},
				onError: (error) => {
					toast("Failed to update room", {
						description: getErrorMessage(error),
						variant: "danger",
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
				<Card.Content className="flex h-96 items-center justify-center">
					<Spinner size="lg" />
				</Card.Content>
			</Card>
		)
	}

	if (!room) {
		return (
			<Card>
				<Card.Content className="flex h-96 items-center justify-center">
					<p className="text-default-500">Room not found</p>
				</Card.Content>
			</Card>
		)
	}

	return (
		<Card>
			<Card.Content className="gap-8 p-5 md:p-8">
				<form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div className="flex flex-col gap-5">
							<h3 className="font-medium text-xl">Room Info</h3>
							<div className="grid grid-cols-2 gap-2">
								<Controller
									control={control}
									name="name"
									render={({ field }) => (
										<TextField className="col-span-2" isRequired isInvalid={!!errors.name} variant="secondary">
											<Label>Room Name</Label>

											<Input {...field} />

											<FieldError>{errors.name?.message}</FieldError>
										</TextField>
									)}
								/>
								<Controller
									control={control}
									name="minAge"
									render={({ field }) => (
										<Select
											isInvalid={!!errors.minAge}
											isRequired
											selectedKey={field.value !== undefined ? String(field.value) : null}
											onSelectionChange={(key) => {
												if (key !== null) {
													field.onChange(Number(key))
													// Re-validate both age fields to check cross-field constraint
													void trigger(["minAge", "maxAge"])
												}
											}}
										>
											<Label>Min age</Label>
											<Select.Trigger>
												<Select.Value />
												<Select.Indicator />
											</Select.Trigger>
											<Select.Popover>
												<ListBox>
													{ROOM_AGE_OPTIONS.map((option) => (
														<ListBox.Item id={String(option.key)} key={option.key} textValue={option.label}>
															{option.label}
															<ListBox.ItemIndicator />
														</ListBox.Item>
													))}
												</ListBox>
											</Select.Popover>
											{errors.minAge?.message && <span className="text-danger text-xs">{errors.minAge.message}</span>}
										</Select>
									)}
								/>
								<Controller
									control={control}
									name="maxAge"
									render={({ field }) => (
										<Select
											isInvalid={!!errors.maxAge}
											isRequired
											selectedKey={field.value !== undefined ? String(field.value) : null}
											onSelectionChange={(key) => {
												if (key !== null) {
													field.onChange(Number(key))
													// Re-validate both age fields to check cross-field constraint
													void trigger(["minAge", "maxAge"])
												}
											}}
										>
											<Label>Max age</Label>
											<Select.Trigger>
												<Select.Value />
												<Select.Indicator />
											</Select.Trigger>
											<Select.Popover>
												<ListBox>
													{ROOM_AGE_OPTIONS.map((option) => (
														<ListBox.Item id={String(option.key)} key={option.key} textValue={option.label}>
															{option.label}
															<ListBox.ItemIndicator />
														</ListBox.Item>
													))}
												</ListBox>
											</Select.Popover>
											{errors.maxAge?.message && <span className="text-danger text-xs">{errors.maxAge.message}</span>}
										</Select>
									)}
								/>
								<Controller
									control={control}
									name="capacity"
									render={({ field }) => (
										<NumberField
											isInvalid={!!errors.capacity}
											isRequired
											minValue={1}
											onChange={(value) => field.onChange(Number.isNaN(value) ? 1 : value)}
											value={field.value}
										>
											<Label>Max capacity</Label>
											<NumberField.Group>
												<NumberField.DecrementButton />
												<NumberField.Input />
												<NumberField.IncrementButton />
											</NumberField.Group>
											{errors.capacity?.message && (
												<span className="text-danger text-xs">{errors.capacity.message}</span>
											)}
										</NumberField>
									)}
								/>
								<Controller
									control={control}
									name="ratio"
									render={({ field }) => (
										<NumberField
											isInvalid={!!errors.ratio}
											isRequired
											minValue={1}
											onChange={(value) => field.onChange(Number.isNaN(value) ? 1 : value)}
											value={field.value}
										>
											<Label>Students per 1 staff</Label>
											<NumberField.Group>
												<NumberField.DecrementButton />
												<NumberField.Input />
												<NumberField.IncrementButton />
											</NumberField.Group>
											{errors.ratio?.message && <span className="text-danger text-xs">{errors.ratio.message}</span>}
										</NumberField>
									)}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-5">
							<h3 className="font-medium text-xl">Profile Picture</h3>
							<div className="flex items-center gap-5">
								<div>
									<Avatar
										className="size-25 bg-[#1D6FE8] text-white shadow-md"
										style={avatarPreview?.startsWith("linear-gradient") ? { background: avatarPreview } : undefined}
									>
										<Avatar.Image
											src={avatarPreview?.startsWith("linear-gradient") ? undefined : (avatarPreview ?? undefined)}
											alt={room.name}
										/>
										<Avatar.Fallback>
											<MaterialSymbolsAddAPhotoRounded className="size-12.5" />
										</Avatar.Fallback>
									</Avatar>
								</div>
								<div className="flex gap-5">
									<Button variant="primary" onPress={() => setIsImagePickerOpen(true)} size="sm">
										Upload Picture
									</Button>
									<Button variant="danger" onPress={handleDeletePicture} size="sm">
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
								selectionMode="multiple"
								value={assignedStaff.map((s) => s.id)}
								onChange={handleStaffSelectionChange}
							>
								<Label>Select Staff</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
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
													<Avatar className="size-8 bg-[#1D6FE8] text-white">
														<Avatar.Image
															src={
																"avatar" in staff && staff.avatar && staff.avatar !== "/assets/avatars/default.jpg"
																	? getMediaUrl(staff.avatar)
																	: undefined
															}
															alt={staff.name}
														/>
														<Avatar.Fallback>
															<OouiUserAvatar className="size-4" />
														</Avatar.Fallback>
													</Avatar>
													<span>{staff.name}</span>
												</div>
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
										{isFetchingNextPage && (
											<ListBox.Item id="loading-staff" textValue="Loading...">
												<span className="text-default-400 text-sm">Loading more...</span>
											</ListBox.Item>
										)}
									</ListBox>
									<div ref={staffObserverRef} />
								</Select.Popover>
							</Select>
							{/* Selected staff chips */}
							{assignedStaff.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{assignedStaff.map((staff) => (
										<Chip key={staff.id} variant="secondary">
											{staff.name}
										</Chip>
									))}
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center justify-between">
						<Button
							variant="danger"
							isDisabled={isSaving}
							onPress={() => openDeactivateRoomModal(roomId, room.name)}
							size="md"
							type="button"
						>
							Deactivate Room
						</Button>
						<div className="flex gap-5">
							<Button isDisabled={isSaving} onPress={handleCancel} size="md" type="button" variant="outline">
								Cancel
							</Button>
							<Button
								variant="primary"
								isDisabled={!hasChanges || !isValid}
								isPending={isSaving}
								size="md"
								type="submit"
							>
								Save Changes
							</Button>
						</div>
					</div>
				</form>
			</Card.Content>
		</Card>
	)
}

export default RoomProfileTab
