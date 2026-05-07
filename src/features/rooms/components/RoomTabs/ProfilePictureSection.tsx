import { Avatar, Button } from "@heroui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import FluentConferenceRoom20Regular from "~icons/fluent/conference-room-20-regular"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"
import MaterialSymbolsUploadRounded from "~icons/material-symbols/upload-rounded"

import ImagePickerModal from "../ImagePickerModal"

interface ProfilePictureSectionProps {
	avatarPreview: string | null | undefined
	roomName: string
	onImageSelect: (image: string | File) => void
	onDeletePicture: () => void
}

const ProfilePictureSection = ({
	avatarPreview,
	roomName,
	onImageSelect,
	onDeletePicture,
}: ProfilePictureSectionProps) => {
	const { t } = useTranslation()
	const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
	const hasPicture = Boolean(avatarPreview)

	return (
		<div className="flex flex-col gap-5">
			<h3 className="font-medium text-xl">{t("rooms.profile.picture.title")}</h3>
			<div className="flex items-center gap-5">
				<div>
					<Avatar
						className="size-25 bg-[#1D6FE8] text-white shadow-md"
						style={avatarPreview?.startsWith("linear-gradient") ? { background: avatarPreview } : undefined}
					>
						<Avatar.Image
							src={avatarPreview?.startsWith("linear-gradient") ? undefined : (avatarPreview ?? undefined)}
							alt={roomName}
						/>
						<Avatar.Fallback>
							<FluentConferenceRoom20Regular className="size-12.5 text-black" />
						</Avatar.Fallback>
					</Avatar>
				</div>
				<div className="flex gap-5">
					<Button variant="primary" onPress={() => setIsImagePickerOpen(true)} size="sm">
						<MaterialSymbolsUploadRounded aria-hidden className="size-4" />
						{t("rooms.profile.picture.upload")}
					</Button>
					<Button variant="danger" isDisabled={!hasPicture} onPress={onDeletePicture} size="sm">
						<MaterialSymbolsDeleteOutline aria-hidden className="size-4" />
						{t("rooms.profile.picture.delete")}
					</Button>
				</div>
			</div>
			<ImagePickerModal
				isOpen={isImagePickerOpen}
				onClose={() => setIsImagePickerOpen(false)}
				onSelect={onImageSelect}
			/>
		</div>
	)
}

export default ProfilePictureSection
