import { Button, Label, ListBox, Modal, Select, Spinner, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useEffect, useRef, useState } from "react"

import { getErrorMessage } from "@/utils/error"

import { useAddStudentsToRoom, useInfiniteAllStudents, useRoom } from "../hooks/useRooms"
import { addStudentModalAtom, closeAddStudentModal } from "../stores/addStudentModal.store"

const AddStudentModal = () => {
	const { isOpen, roomId } = useAtomValue(addStudentModalAtom)
	const { data: room } = useRoom(roomId ?? "")
	const {
		students: allStudents,
		isLoading: isLoadingStudents,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteAllStudents(isOpen)
	const addStudentsMutation = useAddStudentsToRoom()

	const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set())

	// Get current student IDs in the room
	const currentStudentIds = room?.signedInStudents.map((s) => s.id) ?? []

	// Filter out students already in the room
	const availableStudents = allStudents.filter((student) => !currentStudentIds.includes(student.id))

	// IntersectionObserver-based infinite scroll for students list
	const observerRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!observerRef.current || !hasNextPage || isFetchingNextPage) return
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]
				if (entry?.isIntersecting) fetchNextPage()
			},
			{ threshold: 0.5 },
		)
		observer.observe(observerRef.current)
		return () => observer.disconnect()
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	const handleSubmit = () => {
		if (!roomId || selectedStudentIds.size === 0) return

		addStudentsMutation.mutate(
			{
				roomId,
				studentIds: Array.from(selectedStudentIds),
			},
			{
				onSuccess: () => {
					const count = selectedStudentIds.size
					toast(count === 1 ? "Student added" : "Students added", {
						description:
							count === 1 ? "Student has been added to the room." : `${count} students have been added to the room.`,
						variant: "success",
					})
					handleClose()
				},
				onError: (error) => {
					toast("Failed to add students", {
						description: getErrorMessage(error),
						variant: "danger",
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
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>Choose & Add Students</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="gap-5">
						{isLoadingStudents ? (
							<div className="flex h-14 items-center justify-center">
								<Spinner size="md" />
							</div>
						) : (
							<Select
								selectionMode="multiple"
								value={Array.from(selectedStudentIds)}
								onChange={(keys) => {
									setSelectedStudentIds(new Set(keys as string[]))
								}}
							>
								<Label>Student's Name</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
									<ListBox>
										{availableStudents.map((student) => (
											<ListBox.Item id={student.id} key={student.id} textValue={student.name}>
												{student.name}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
										{isFetchingNextPage && (
											<ListBox.Item id="loading-students" textValue="Loading...">
												<span className="text-default-400 text-sm">Loading more...</span>
											</ListBox.Item>
										)}
									</ListBox>
									<div ref={observerRef} />
								</Select.Popover>
							</Select>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							fullWidth
							isDisabled={!isFormValid || isLoadingStudents}
							isPending={addStudentsMutation.isPending}
							onPress={handleSubmit}
						>
							Add Students
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default AddStudentModal
