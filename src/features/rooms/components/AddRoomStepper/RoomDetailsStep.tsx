import { Avatar, Input, NumberInput, Select, SelectItem } from "@heroui/react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import TablerPencil from "~icons/tabler/pencil"

import ImagePickerModal from "../ImagePickerModal"

import type { AddRoomFormData } from "../../types"

const ageOptions = [
	{ key: "0", label: "0 years" },
	{ key: "1", label: "1 year" },
	{ key: "2", label: "2 years" },
	{ key: "3", label: "3 years" },
	{ key: "4", label: "4 years" },
	{ key: "5", label: "5 years" },
	{ key: "6", label: "6 years" },
	{ key: "7", label: "7 years" },
]

const RoomDetailsStep = () => {
	const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
	const {
		control,
		watch,
		setValue,
		formState: { errors },
	} = useFormContext<AddRoomFormData>()

	const name = watch("name")
	const avatarPreview = watch("avatarPreview")

	const handleAvatarClick = () => {
		setIsImagePickerOpen(true)
	}

	const handleImageSelect = (image: string | File) => {
		if (typeof image === "string") {
			// It's a gradient
			setValue("avatarPreview", image)
			setValue("avatarFile", undefined)
		} else {
			// It's a file
			const previewUrl = URL.createObjectURL(image)
			setValue("avatarFile", image)
			setValue("avatarPreview", previewUrl)
		}
	}

	const isGradient = avatarPreview?.startsWith("linear-gradient")

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-medium text-xl">Add room</h2>

			{/* Room Avatar */}
			<div className="flex flex-col items-center gap-2">
				<div className="relative">
					{isGradient ? (
						<button
							className="size-14 cursor-pointer rounded-full"
							onClick={handleAvatarClick}
							style={{ background: avatarPreview }}
							type="button"
						/>
					) : (
						<Avatar
							className="size-14 cursor-pointer text-lg"
							color="primary"
							name={name || "R"}
							onClick={handleAvatarClick}
							showFallback
							src={avatarPreview}
						/>
					)}
					<button
						className="-right-1 -top-1 absolute flex size-6 cursor-pointer items-center justify-center rounded-full bg-warning"
						onClick={handleAvatarClick}
						type="button"
					>
						<TablerPencil className="size-4 text-white" />
					</button>
				</div>
				<span className="text-foreground text-sm">Room Avatar</span>
				<ImagePickerModal
					isOpen={isImagePickerOpen}
					onClose={() => setIsImagePickerOpen(false)}
					onSelect={handleImageSelect}
				/>
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
							label="Students per staff"
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
				<div className="grid grid-cols-2 gap-3">
					<Controller
						control={control}
						name="minAge"
						render={({ field }) => (
							<Select
								errorMessage={errors.minAge?.message}
								isInvalid={!!errors.minAge}
								isRequired
								label="Min Age"
								labelPlacement="inside"
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0]
									if (selected !== undefined) {
										field.onChange(Number(selected))
									}
								}}
								radius="md"
								selectedKeys={field.value !== undefined ? [String(field.value)] : []}
								variant="flat"
							>
								{ageOptions.map((option) => (
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
								label="Max Age"
								labelPlacement="inside"
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0]
									if (selected !== undefined) {
										field.onChange(Number(selected))
									}
								}}
								radius="md"
								selectedKeys={field.value !== undefined ? [String(field.value)] : []}
								variant="flat"
							>
								{ageOptions.map((option) => (
									<SelectItem key={option.key}>{option.label}</SelectItem>
								))}
							</Select>
						)}
					/>
				</div>
			</div>
		</div>
	)
}

export default RoomDetailsStep
