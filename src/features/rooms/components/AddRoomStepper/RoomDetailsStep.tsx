import { Avatar, Input, NumberInput } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useRef } from "react"

import type { AddRoomFormData } from "../../types"

interface RoomDetailsStepProps {
	formData: AddRoomFormData
	onChange: (data: Partial<AddRoomFormData>) => void
}

const RoomDetailsStep = ({ formData, onChange }: RoomDetailsStepProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleAvatarClick = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const previewUrl = URL.createObjectURL(file)
			onChange({ avatarFile: file, avatarPreview: previewUrl })
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-medium text-xl">Add room</h2>

			{/* Room Avatar */}
			<div className="flex flex-col items-center gap-2">
				<div className="relative">
					<Avatar
						className="size-14 cursor-pointer text-lg"
						color="primary"
						name={formData.name || "R"}
						onClick={handleAvatarClick}
						showFallback
						src={formData.avatarPreview}
					/>
					<button
						className="-right-1 -top-1 absolute flex size-6 cursor-pointer items-center justify-center rounded-full bg-warning"
						onClick={handleAvatarClick}
						type="button"
					>
						<Icon className="size-4 text-white" icon="tabler:pencil" />
					</button>
					<input accept="image/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} type="file" />
				</div>
				<span className="text-foreground text-sm">Room Avatar</span>
			</div>

			{/* Form Fields */}
			<div className="flex flex-col gap-3">
				<Input
					label="Room Name"
					labelPlacement="inside"
					onChange={(e) => onChange({ name: e.target.value })}
					placeholder="Enter room name"
					radius="md"
					value={formData.name}
					variant="flat"
				/>
				<NumberInput
					label="Room Capacity"
					labelPlacement="inside"
					minValue={0}
					onValueChange={(value) => onChange({ capacity: value ?? 0 })}
					placeholder="Enter capacity"
					radius="md"
					value={formData.capacity}
					variant="flat"
				/>
			</div>
		</div>
	)
}

export default RoomDetailsStep
