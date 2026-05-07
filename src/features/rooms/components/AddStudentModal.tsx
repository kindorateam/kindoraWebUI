import { Button, Label, ListBox, Modal, Select, Spinner, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"

import { useAddStudentModalStudents } from "../hooks/useRoomSelectQueries"
import { useAddStudentsToRoom, useRoom } from "../hooks/useRooms"
import { addStudentModalAtom, closeAddStudentModal } from "../stores/addStudentModal.store"
import { handleSelectPopoverScroll } from "../utils/handleSelectPopoverScroll"

const AddStudentModal = () => {
	const { t } = useTranslation()
	const { isOpen, roomId } = useAtomValue(addStudentModalAtom)
	const { data: room } = useRoom(roomId ?? "")
	const {
		students: allStudents,
		isLoading: isLoadingStudents,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useAddStudentModalStudents(isOpen)
	const addStudentsMutation = useAddStudentsToRoom()

	const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set())
	const loadMoreLockRef = useRef(false)

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
			},
			{
				onSuccess: () => {
					const count = selectedStudentIds.size
					toast(t("rooms.addStudent.success", { count }), {
						description: t("rooms.addStudent.successDescription", { count }),
						variant: "success",
					})
					handleClose()
				},
				onError: (error) => {
					toast(t("rooms.addStudent.error"), {
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
						<Modal.Heading>{t("rooms.addStudent.title")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="gap-5">
						{isLoadingStudents ? (
							<div className="flex h-14 items-center justify-center">
								<Spinner size="md" />
							</div>
						) : (
							<Select
								selectionMode="multiple"
								variant="secondary"
								value={Array.from(selectedStudentIds)}
								onChange={(keys) => {
									setSelectedStudentIds(new Set(keys as string[]))
								}}
							>
								<Label>{t("rooms.addStudent.studentName")}</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover
									className="max-h-60!"
									onScroll={(e) => {
										handleSelectPopoverScroll(
											e,
											hasNextPage ?? false,
											isFetchingNextPage,
											loadMoreLockRef,
											fetchNextPage,
										)
									}}
								>
									<ListBox>
										{availableStudents.map((student) => (
											<ListBox.Item id={student.id} key={student.id} textValue={student.name}>
												{student.name}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
										{isFetchingNextPage && (
											<ListBox.Item id="loading-students" textValue={t("common.loading")}>
												<span className="text-default-400 text-sm">{t("common.loadingMore")}</span>
											</ListBox.Item>
										)}
									</ListBox>
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
							{t("rooms.addStudent.add")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default AddStudentModal
