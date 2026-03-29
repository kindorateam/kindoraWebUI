import { Avatar, FieldError, Input, Label, ListBox, NumberField, Select, TextField } from "@heroui/react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import TablerPencil from "~icons/tabler/pencil"

import { ROOM_AGE_OPTIONS } from "../../constants"
import ImagePickerModal from "../ImagePickerModal"

import type { AddRoomFormData } from "../../types"

const ageListItems = ROOM_AGE_OPTIONS.map((option) => (
	<ListBox.Item id={String(option.key)} key={option.key} textValue={option.label}>
		{option.label}
		<ListBox.ItemIndicator />
	</ListBox.Item>
))

const RoomDetailsStep = () => {
	const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
	const {
		control,
		watch,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext<AddRoomFormData>()

	const name = watch("name")
	const avatarPreview = watch("avatarPreview")
	const minAge = watch("minAge")
	const maxAge = watch("maxAge")

	const handleAvatarClick = () => {
		setIsImagePickerOpen(true)
	}

	const handleImageSelect = (image: string | File) => {
		if (typeof image === "string") {
			// It's a gradient
			setValue("avatarPreview", image)
			setValue("avatarFile", undefined)
		} else {
			// It's a file - create preview URL
			// Note: Object URLs are not revoked here because the component unmounts
			// when navigating between steps. Browser cleans up when page unloads.
			const previewUrl = URL.createObjectURL(image)
			setValue("avatarFile", image)
			setValue("avatarPreview", previewUrl)
		}
	}

	const isGradient = avatarPreview?.startsWith("linear-gradient")

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-medium text-foreground text-xl">Add room</h2>

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
						<Avatar className="size-14 cursor-pointer text-lg" onClick={handleAvatarClick}>
							<Avatar.Image src={avatarPreview ?? undefined} alt={name || "R"} />
							<Avatar.Fallback>{name?.charAt(0) || "R"}</Avatar.Fallback>
						</Avatar>
					)}
					<button
						className="absolute -top-1 -right-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-warning"
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
						<TextField isRequired isInvalid={!!errors.name} variant="secondary">
							<Label>Room Name</Label>

							<Input {...field} placeholder="Enter room name" />

							<FieldError>{errors.name?.message}</FieldError>
						</TextField>
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
							variant="secondary"
						>
							<Label>Room Capacity</Label>
							<NumberField.Group>
								<NumberField.DecrementButton />
								<NumberField.Input placeholder="Enter capacity" />
								<NumberField.IncrementButton />
							</NumberField.Group>
							{errors.capacity?.message && <FieldError>{errors.capacity.message}</FieldError>}
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
							variant="secondary"
						>
							<Label>Students per staff</Label>
							<NumberField.Group>
								<NumberField.DecrementButton />
								<NumberField.Input placeholder="Enter ratio" />
								<NumberField.IncrementButton />
							</NumberField.Group>
							{errors.ratio?.message && <FieldError>{errors.ratio.message}</FieldError>}
						</NumberField>
					)}
				/>
				<div className="grid grid-cols-2 gap-3">
					<Controller
						control={control}
						name="minAge"
						render={({ field }) => (
							<Select
								isInvalid={!!errors.minAge}
								isRequired
								selectedKey={field.value !== undefined ? String(field.value) : null}
								variant="secondary"
								onSelectionChange={(key) => {
									if (key !== null) {
										field.onChange(Number(key))
										// Only cross-validate when both ages are selected
										if (maxAge !== undefined) {
											void trigger(["minAge", "maxAge"])
										}
									}
								}}
							>
								<Label>Min Age</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover className="max-h-60!">
									<ListBox>{ageListItems}</ListBox>
								</Select.Popover>
								{errors.minAge?.message && <FieldError>{errors.minAge.message}</FieldError>}
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
								variant="secondary"
								onSelectionChange={(key) => {
									if (key !== null) {
										field.onChange(Number(key))
										// Only cross-validate when both ages are selected
										if (minAge !== undefined) {
											void trigger(["minAge", "maxAge"])
										}
									}
								}}
							>
								<Label>Max Age</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover className="max-h-60!">
									<ListBox>{ageListItems}</ListBox>
								</Select.Popover>
								{errors.maxAge?.message && <FieldError>{errors.maxAge.message}</FieldError>}
							</Select>
						)}
					/>
				</div>
			</div>
		</div>
	)
}

export default RoomDetailsStep
