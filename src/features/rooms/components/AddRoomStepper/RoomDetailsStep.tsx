import { Avatar, Input, NumberInput } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useRef } from "react"
import { Controller, useFormContext } from "react-hook-form"

import type { AddRoomFormData } from "../../types"

const RoomDetailsStep = () => {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const {
		control,
		watch,
		setValue,
		formState: { errors },
	} = useFormContext<AddRoomFormData>()

	const name = watch("name")
	const avatarPreview = watch("avatarPreview")

	const handleAvatarClick = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const previewUrl = URL.createObjectURL(file)
			setValue("avatarFile", file)
			setValue("avatarPreview", previewUrl)
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
						name={name || "R"}
						onClick={handleAvatarClick}
						showFallback
						src={avatarPreview}
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
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.name?.message}
							isInvalid={!!errors.name}
							isRequired
							label="Room Name"
							labelPlacement="inside"
							placeholder="Enter room name"
							radius="md"
							variant="flat"
						/>
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
							label="Room Capacity"
							labelPlacement="inside"
							minValue={1}
							onValueChange={(value) => field.onChange(value ?? 1)}
							placeholder="Enter capacity"
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
							label="Ratio"
							labelPlacement="inside"
							minValue={1}
							onValueChange={(value) => field.onChange(value ?? 1)}
							placeholder="Enter ratio"
							radius="md"
							value={field.value}
							variant="flat"
						/>
					)}
				/>
			</div>
		</div>
	)
}

export default RoomDetailsStep
