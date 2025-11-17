import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Input } from "@heroui/react"
import { useAtomValue, useSetAtom } from "jotai"
import { useCallback } from "react"
import { Controller, useForm } from "react-hook-form"

import Button from "@/components/Button"
import Text from "@/components/Text"
import { addRoomDrawerIsOpenAtom, closeAddRoomDrawerAtom } from "@/features/rooms/stores/addRoomDrawer.store"

import AvatarUpload from "./AvatarUpload"

export interface AddRoomFormData {
	name: string
	capacity: number
	avatar?: File | null
}

interface AddRoomDrawerProps {
	onSubmit?: (data: AddRoomFormData) => Promise<void>
}

const AddRoomDrawer = ({ onSubmit }: AddRoomDrawerProps) => {
	const isOpen = useAtomValue(addRoomDrawerIsOpenAtom)
	const closeDrawer = useSetAtom(closeAddRoomDrawerAtom)

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AddRoomFormData>({
		defaultValues: {
			name: "",
			capacity: undefined,
			avatar: null,
		},
		mode: "onBlur",
	})

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open) {
				reset()
				closeDrawer()
			}
		},
		[closeDrawer, reset],
	)

	const handleFormSubmit = async (data: AddRoomFormData) => {
		try {
			await onSubmit?.(data)
			reset()
			closeDrawer()
		} catch (error) {
			// Error handling will be implemented later
			console.error("Failed to add room:", error)
		}
	}

	return (
		<Drawer
			backdrop="blur"
			hideCloseButton
			isDismissable
			isOpen={isOpen}
			onOpenChange={handleOpenChange}
			placement="right"
			size="lg"
		>
			<DrawerContent>
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<DrawerHeader className="border-black/5 border-b px-6 pt-8 pb-6">
						<Text as="h2" size={24} weight="bold">
							Add Room
						</Text>
					</DrawerHeader>

					<DrawerBody className="flex flex-col gap-6 px-6 py-6">
						{/* Room Avatar */}
						<div className="flex flex-col gap-2">
							<Text size={14} weight="medium">
								Room Avatar
							</Text>
							<Controller
								control={control}
								name="avatar"
								render={({ field }) => <AvatarUpload onChange={field.onChange} value={field.value ?? undefined} />}
							/>
						</div>

						{/* Room Name */}
						<Controller
							control={control}
							name="name"
							render={({ field }) => (
								<Input
									{...field}
									classNames={{
										input: "text-base",
										inputWrapper: "border border-black/10 bg-white data-[hover=true]:bg-white h-12",
									}}
									errorMessage={errors.name?.message}
									isInvalid={!!errors.name}
									label="Room Name"
									labelPlacement="outside"
									placeholder="Enter room name"
									variant="bordered"
								/>
							)}
							rules={{
								required: "Room name is required",
								minLength: {
									value: 1,
									message: "Room name cannot be empty",
								},
							}}
						/>

						{/* Room Capacity */}
						<Controller
							control={control}
							name="capacity"
							render={({ field: { onChange, value, ...field } }) => (
								<Input
									{...field}
									classNames={{
										input: "text-base",
										inputWrapper: "border border-black/10 bg-white data-[hover=true]:bg-white h-12",
									}}
									errorMessage={errors.capacity?.message}
									isInvalid={!!errors.capacity}
									label="Room Capacity"
									labelPlacement="outside"
									onChange={(e) => {
										const val = e.target.value
										onChange(val === "" ? undefined : Number(val))
									}}
									placeholder="Enter room capacity"
									type="number"
									value={value?.toString() ?? ""}
									variant="bordered"
								/>
							)}
							rules={{
								required: "Room capacity is required",
								validate: {
									positive: (value) => {
										if (value === undefined || value === null) return "Room capacity is required"
										const num = Number(value)
										if (Number.isNaN(num)) return "Please enter a valid number"
										if (num <= 0) return "Capacity must be a positive number"
										if (!Number.isInteger(num)) return "Capacity must be a whole number"
										return true
									},
								},
							}}
						/>
					</DrawerBody>

					<DrawerFooter className="border-black/5 border-t px-6 pt-4 pb-6">
						<div className="flex w-full justify-end gap-3">
							<Button color="secondary" isDisabled={isSubmitting} onPress={() => handleOpenChange(false)}>
								Cancel
							</Button>
							<Button isLoading={isSubmitting} type="submit">
								Add
							</Button>
						</div>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	)
}

export default AddRoomDrawer
