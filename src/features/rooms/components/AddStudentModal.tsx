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

import { useAddStudentsToRoom, useAllStudents, useRoom } from "../hooks/useRooms"
import { addStudentModalAtom, closeAddStudentModal } from "../stores/addStudentModal.store"

const AddStudentModal = () => {
	const { isOpen, roomId } = useAtomValue(addStudentModalAtom)
	const { data: room } = useRoom(roomId ?? "")
	const { data: allStudents = [], isLoading: isLoadingStudents } = useAllStudents(isOpen)
	const addStudentsMutation = useAddStudentsToRoom()

	const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set())

	// Get current student IDs in the room
	const currentStudentIds = room?.signedInStudents.map((s) => s.id) ?? []

	// Filter out students already in the room
	const availableStudents = allStudents.filter((student) => !currentStudentIds.includes(student.id))

	const handleSubmit = () => {
		if (!roomId || selectedStudentIds.size === 0) return

		addStudentsMutation.mutate(
			{
				roomId,
				studentIds: Array.from(selectedStudentIds),
				currentStudentIds,
			},
			{
				onSuccess: () => {
					const count = selectedStudentIds.size
					addToast({
						title: count === 1 ? "Student added" : "Students added",
						description:
							count === 1 ? "Student has been added to the room." : `${count} students have been added to the room.`,
						color: "success",
					})
					handleClose()
				},
				onError: () => {
					addToast({
						title: "Failed to add students",
						description: "Please try again.",
						color: "danger",
					})
				},
			},
		)
	}

	const handleClose = () => {
		if (!addStudentsMutation.isPending) {
			addStudentsMutation.reset()
			setSelectedStudentIds(new Set())
			closeAddStudentModal()
		}
	}

	const isFormValid = selectedStudentIds.size > 0

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
					<span className="font-medium text-xl">Choose & Add Students</span>
				</ModalHeader>
				<ModalBody className="gap-5 py-5">
					{isLoadingStudents ? (
						<div className="flex h-14 items-center justify-center">
							<Spinner size="md" />
						</div>
					) : (
						<Select
							label="Student's Name"
							placeholder="Select students"
							selectionMode="multiple"
							selectedKeys={selectedStudentIds}
							onSelectionChange={(keys) => {
								if (keys === "all") {
									setSelectedStudentIds(new Set(availableStudents.map((s) => s.id)))
								} else {
									setSelectedStudentIds(new Set(keys as Set<string>))
								}
							}}
							listboxProps={{ emptyContent: "No students available" }}
							radius="md"
							variant="flat"
						>
							{availableStudents.map((student) => (
								<SelectItem key={student.id}>{student.name}</SelectItem>
							))}
						</Select>
					)}
				</ModalBody>
				<ModalFooter className="pt-0">
					<Button
						color="primary"
						fullWidth
						isLoading={addStudentsMutation.isPending}
						isDisabled={!isFormValid || isLoadingStudents}
						onPress={handleSubmit}
						radius="md"
					>
						Add Students
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default AddStudentModal
