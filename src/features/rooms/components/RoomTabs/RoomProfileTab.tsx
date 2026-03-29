import { Button, Card, Spinner, toast } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"
import { getMediaUrl } from "@/utils/media"
import CiSave from "~icons/ci/save"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"

import { useRoom, useUpdateRoom, useUpdateRoomLogo } from "../../hooks/useRooms"
import { roomProfileSchema } from "../../schemas/roomProfile.schema"
import { openDeactivateRoomModal } from "../../stores/deactivateRoomModal.store"

import ProfilePictureSection from "./ProfilePictureSection"
import RoomInfoFields from "./RoomInfoFields"
import StaffSelect from "./StaffSelect"

import type { RoomProfileFormData } from "../../schemas/roomProfile.schema"
import type { EmployeeOption, StaffMember } from "../../types"

type StaffItem = StaffMember | EmployeeOption

interface RoomProfileTabProps {
	roomId: string
}

const RoomProfileTab = ({ roomId }: RoomProfileTabProps) => {
	const { data: room, isLoading } = useRoom(roomId)
	const updateRoomMutation = useUpdateRoom()
	const updateLogoMutation = useUpdateRoomLogo()

	const [assignedStaff, setAssignedStaff] = useState<StaffItem[]>([])

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		trigger,
		formState: { errors, isDirty },
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
			void trigger()
		}
	}, [room, reset, trigger])

	const handleImageSelect = (image: string | File) => {
		if (typeof image === "string") {
			setValue("avatarPreview", image, { shouldDirty: true })
			setValue("avatarFile", null, { shouldDirty: true })
		} else {
			const previewUrl = URL.createObjectURL(image)
			setValue("avatarPreview", previewUrl, { shouldDirty: true })
			setValue("avatarFile", image, { shouldDirty: true })
		}
	}

	const handleDeletePicture = () => {
		setValue("avatarPreview", null, { shouldDirty: true })
		setValue("avatarFile", null, { shouldDirty: true })
	}

	const handleStaffSelectionChange = (staff: StaffItem[], ids: string[]) => {
		setAssignedStaff(staff)
		setValue("staffIds", ids, { shouldDirty: true })
	}

	const handleCancel = () => {
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
		<Card className="shadow-xl">
			<Card.Content>
				<form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<RoomInfoFields control={control} errors={errors} trigger={trigger} />
						<ProfilePictureSection
							avatarPreview={avatarPreview}
							roomName={room.name}
							onImageSelect={handleImageSelect}
							onDeletePicture={handleDeletePicture}
						/>
						<StaffSelect assignedStaff={assignedStaff} onSelectionChange={handleStaffSelectionChange} />
					</div>

					<div className="flex items-center justify-between">
						<Button
							variant="danger"
							isDisabled={isSaving}
							onPress={() => openDeactivateRoomModal(roomId, room.name)}
							size="md"
							type="button"
						>
							<MaterialSymbolsDeleteOutline aria-hidden className="size-4" />
							Deactivate Room
						</Button>
						<div className="flex gap-5">
							<Button isDisabled={isSaving} onPress={handleCancel} size="md" type="button" variant="outline">
								Cancel
							</Button>
							<Button
								variant="primary"
								isDisabled={!hasChanges || Object.keys(errors).length > 0}
								isPending={isSaving}
								size="md"
								type="submit"
							>
								<CiSave aria-hidden className="size-4" />
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
