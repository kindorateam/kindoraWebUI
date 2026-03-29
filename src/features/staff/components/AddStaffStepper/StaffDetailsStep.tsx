import { Avatar, FieldError, Input, Label, ListBox, Select, Switch, TextField } from "@heroui/react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import ImagePickerModal from "@/features/rooms/components/ImagePickerModal"
import TablerPencil from "~icons/tabler/pencil"

import { STAFF_ROLES } from "../../constants"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const StaffDetailsStep = () => {
	const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
	const {
		control,
		watch,
		setValue,
		formState: { errors },
	} = useFormContext<AddStaffFormData>()

	const firstName = watch("firstName")
	const avatarPreview = watch("avatarPreview")

	const handleAvatarClick = () => {
		setIsImagePickerOpen(true)
	}

	const handleImageSelect = (image: string | File) => {
		if (typeof image === "string") {
			setValue("avatarPreview", image)
			setValue("avatarFile", undefined)
		} else {
			const previewUrl = URL.createObjectURL(image)
			setValue("avatarFile", image)
			setValue("avatarPreview", previewUrl)
		}
	}

	const isGradient = avatarPreview?.startsWith("linear-gradient")

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-medium text-xl">Add staff</h2>

			{/* Staff Avatar */}
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
							<Avatar.Image src={avatarPreview} alt={firstName || "S"} />
							<Avatar.Fallback>{firstName?.[0] ?? "S"}</Avatar.Fallback>
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
				<span className="text-foreground text-sm">Staff Avatar</span>
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
					name="firstName"
					render={({ field }) => (
						<TextField isRequired isInvalid={!!errors.firstName} variant="secondary">
							<Label>First Name</Label>

							<Input {...field} placeholder="Enter first name" />

							<FieldError>{errors.firstName?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="lastName"
					render={({ field }) => (
						<TextField isRequired isInvalid={!!errors.lastName} variant="secondary">
							<Label>Last Name</Label>

							<Input {...field} placeholder="Enter last name" />

							<FieldError>{errors.lastName?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="role"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.role}
							isRequired
							onSelectionChange={(key) => {
								if (key !== undefined) {
									field.onChange(String(key))
								}
							}}
							selectedKey={field.value ?? null}
						>
							<Label>Role</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{STAFF_ROLES.map((role) => (
										<ListBox.Item id={role.key} key={role.key} textValue={role.label}>
											<div className="flex flex-col">
												<span>{role.label}</span>
												<span className="text-default-400 text-xs">{role.description}</span>
											</div>
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							{errors.role?.message && <span className="text-danger text-xs">{errors.role.message}</span>}
						</Select>
					)}
				/>
				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<TextField isRequired isInvalid={!!errors.email} variant="secondary">
							<Label>Email</Label>

							<Input {...field} placeholder="Enter email address" type="email" />

							<FieldError>{errors.email?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="inviteToKindora"
					render={({ field }) => (
						<div className="flex items-center justify-between py-3">
							<span className="text-default-600 text-sm">Invite staff to join Kindora on their devices?</span>
							<Switch isSelected={field.value} onChange={field.onChange}>
								<Switch.Control>
									<Switch.Thumb />
								</Switch.Control>
								<Switch.Content>
									<Label>Invite</Label>
								</Switch.Content>
							</Switch>
						</div>
					)}
				/>
			</div>
		</div>
	)
}

export default StaffDetailsStep
