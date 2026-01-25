import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Spinner,
	addToast,
} from "@heroui/react"
import { useAtomValue } from "jotai"
import { useState } from "react"

import { useMoveStudentsToRoom, useRooms } from "../hooks/useRooms"
import { closeTransferStudentModal, transferStudentModalAtom } from "../stores/transferStudentModal.store"

const TransferStudentModal = () => {
	const { isOpen, sourceRoomId, studentIds } = useAtomValue(transferStudentModalAtom)
	const { rooms, isLoading: isLoadingRooms } = useRooms({ status: "active", limit: 100 })
	const moveStudentsMutation = useMoveStudentsToRoom()

	const [selectedRoomId, setSelectedRoomId] = useState<string>("")

	// Filter out the current room from the list
	const availableRooms = rooms.filter((room) => room.id !== sourceRoomId)

	const handleSubmit = () => {
		if (!sourceRoomId || !selectedRoomId || studentIds.length === 0) return

		moveStudentsMutation.mutate(
			{
				sourceRoomId,
				targetRoomId: selectedRoomId,
				studentIds,
			},
			{
				onSuccess: () => {
					const count = studentIds.length
					addToast({
						title: count === 1 ? "Student transferred" : "Students transferred",
						description:
							count === 1
								? "Student has been transferred to the new room."
								: `${count} students have been transferred to the new room.`,
						color: "success",
					})
					handleClose()
				},
				onError: () => {
					addToast({
						title: "Failed to transfer students",
						description: "Please try again.",
						color: "danger",
					})
				},
			},
		)
	}

	const handleClose = () => {
		if (!moveStudentsMutation.isPending) {
			moveStudentsMutation.reset()
			setSelectedRoomId("")
			closeTransferStudentModal()
		}
	}

	const isFormValid = !!selectedRoomId

	return (
		<Modal
			classNames={{ closeButton: "cursor-pointer" }}
			isOpen={isOpen}
			onOpenChange={(open) => !open && handleClose()}
			placement="center"
			size="sm"
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1 pb-0">
					<span className="font-medium text-xl">Transfer to another Room</span>
					<span className="font-normal text-default-500 text-sm">
						{studentIds.length} {studentIds.length === 1 ? "student" : "students"} selected
					</span>
				</ModalHeader>
				<ModalBody className="gap-5 py-5">
					{isLoadingRooms ? (
						<div className="flex h-14 items-center justify-center">
							<Spinner size="md" />
						</div>
					) : (
						<Select
							label="Target Room"
							placeholder="Select a room"
							selectedKeys={selectedRoomId ? [selectedRoomId] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0]
								if (selected) setSelectedRoomId(String(selected))
							}}
							listboxProps={{ emptyContent: "No rooms available" }}
							radius="md"
							variant="flat"
						>
							{availableRooms.map((room) => (
								<SelectItem key={room.id}>{room.name}</SelectItem>
							))}
						</Select>
					)}
				</ModalBody>
				<ModalFooter className="pt-0">
					<Button
						color="primary"
						fullWidth
						isLoading={moveStudentsMutation.isPending}
						isDisabled={!isFormValid || isLoadingRooms}
						onPress={handleSubmit}
						radius="md"
					>
						Transfer
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default TransferStudentModal
