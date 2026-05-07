import { Button, Label, ListBox, Modal, Select, Spinner, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"

import { useTransferStudentRooms } from "../hooks/useRoomSelectQueries"
import { useMoveStudentsToRoom } from "../hooks/useRooms"
import { closeTransferStudentModal, transferStudentModalAtom } from "../stores/transferStudentModal.store"
import { handleSelectPopoverScroll } from "../utils/handleSelectPopoverScroll"

interface TransferStudentModalProps {
	onSuccess?: () => void
}

const TransferStudentModal = ({ onSuccess }: TransferStudentModalProps) => {
	const { t } = useTranslation()
	const { isOpen, sourceRoomId, studentIds } = useAtomValue(transferStudentModalAtom)
	const {
		rooms,
		isLoading: isLoadingRooms,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useTransferStudentRooms(isOpen)
	const moveStudentsMutation = useMoveStudentsToRoom()

	const [selectedRoomId, setSelectedRoomId] = useState<string>("")
	const loadMoreLockRef = useRef(false)

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
					toast(t("rooms.transferStudent.success", { count }), {
						description: t("rooms.transferStudent.successDescription", { count }),
						variant: "success",
					})
					onSuccess?.()
					handleClose()
				},
				onError: (error) => {
					toast(t("rooms.transferStudent.error"), {
						description: getErrorMessage(error),
						variant: "danger",
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
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>{t("rooms.transferStudent.title")}</Modal.Heading>
						<span className="font-normal text-default-500 text-sm">
							{t("rooms.transferStudent.selectedStudents", { count: studentIds.length })}
						</span>
					</Modal.Header>
					<Modal.Body className="gap-5">
						{isLoadingRooms ? (
							<div className="flex h-14 items-center justify-center">
								<Spinner size="md" />
							</div>
						) : (
							<Select
								variant="secondary"
								selectedKey={selectedRoomId || null}
								onSelectionChange={(key) => {
									if (key !== null) setSelectedRoomId(String(key))
								}}
							>
								<Label>{t("rooms.transferStudent.targetRoom")}</Label>
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
										{availableRooms.map((room) => (
											<ListBox.Item id={room.id} key={room.id} textValue={room.name}>
												{room.name}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
										{isFetchingNextPage && (
											<ListBox.Item id="loading-rooms" textValue={t("common.loading")}>
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
							isDisabled={!isFormValid || isLoadingRooms}
							isPending={moveStudentsMutation.isPending}
							onPress={handleSubmit}
						>
							{t("rooms.transferStudent.transfer")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default TransferStudentModal
