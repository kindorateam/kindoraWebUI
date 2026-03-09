import { Avatar, Input, Select, SelectItem, Switch } from "@heroui/react"
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
						<Avatar
							className="size-14 cursor-pointer text-lg"
							color="primary"
							name={firstName || "S"}
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
						<Input
							{...field}
							errorMessage={errors.firstName?.message}
							isInvalid={!!errors.firstName}
							isRequired
							label="First Name"
							labelPlacement="inside"
							placeholder="Enter first name"
							radius="md"
							size="sm"
							variant="flat"
						/>
					)}
				/>
				<Controller
					control={control}
					name="lastName"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.lastName?.message}
							isInvalid={!!errors.lastName}
							isRequired
							label="Last Name"
							labelPlacement="inside"
							placeholder="Enter last name"
							radius="md"
							size="sm"
							variant="flat"
						/>
					)}
				/>
				<Controller
					control={control}
					name="role"
					render={({ field }) => (
						<Select
							errorMessage={errors.role?.message}
							isInvalid={!!errors.role}
							isRequired
							label="Role"
							labelPlacement="inside"
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0]
								if (selected !== undefined) {
									field.onChange(String(selected))
								}
							}}
							radius="md"
							selectedKeys={field.value ? [field.value] : []}
							size="sm"
							variant="flat"
						>
							{STAFF_ROLES.map((role) => (
								<SelectItem key={role.key} textValue={role.label}>
									<div className="flex flex-col">
										<span>{role.label}</span>
										<span className="text-default-400 text-tiny">{role.description}</span>
									</div>
								</SelectItem>
							))}
						</Select>
					)}
				/>
				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.email?.message}
							isInvalid={!!errors.email}
							isRequired
							label="Email"
							labelPlacement="inside"
							placeholder="Enter email address"
							radius="md"
							size="sm"
							type="email"
							variant="flat"
						/>
					)}
				/>
				<Controller
					control={control}
					name="inviteToKindora"
					render={({ field }) => (
						<div className="flex items-center justify-between py-3">
							<span className="text-default-600 text-sm">Invite staff to join Kindora on their devices?</span>
							<Switch isSelected={field.value} onValueChange={field.onChange} />
						</div>
					)}
				/>
			</div>
		</div>
	)
}

export default StaffDetailsStep
