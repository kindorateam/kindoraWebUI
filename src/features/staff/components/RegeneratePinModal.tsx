import { Button, Modal, ModalContent, addToast } from "@heroui/react"
import { useAtomValue } from "jotai"

import { getErrorMessage } from "@/utils/error"

import { useRegenerateEmployeePin } from "../hooks/useStaff"
import { closeRegeneratePinModal, isRegeneratePinModalOpenAtom } from "../stores/regeneratePinModal.store"

interface Props {
	employeeId: string
}

export default function RegeneratePinModal({ employeeId }: Props) {
	const isOpen = useAtomValue(isRegeneratePinModalOpenAtom)
	const regenerateMutation = useRegenerateEmployeePin()

	const handleRegenerate = () => {
		regenerateMutation.mutate(
			{ employeeId },
			{
				onSuccess: () => {
					addToast({
						title: "PIN regenerated",
						description: "A new PIN has been generated successfully.",
						color: "success",
					})
					closeRegeneratePinModal()
				},
				onError: (error) => {
					addToast({
						title: "Failed to regenerate PIN",
						description: getErrorMessage(error),
						color: "danger",
					})
				},
			},
		)
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={(open) => !open && closeRegeneratePinModal()} placement="center" size="sm">
			<ModalContent>
				<div className="flex flex-col items-center gap-5 px-7 py-8">
					<div className="flex flex-col items-center gap-3 text-center">
						<h3 className="font-medium text-xl leading-7">Regenerate PIN</h3>
						<p className="text-foreground text-sm leading-5">
							Are you sure you want to regenerate the PIN? The current PIN will be replaced with a new one.
						</p>
					</div>
					<div className="flex w-full flex-col gap-3">
						<Button
							className="w-full"
							color="primary"
							isLoading={regenerateMutation.isPending}
							onPress={handleRegenerate}
						>
							Regenerate
						</Button>
						<Button
							color="default"
							fullWidth
							isDisabled={regenerateMutation.isPending}
							onPress={closeRegeneratePinModal}
							size="md"
						>
							Cancel
						</Button>
					</div>
				</div>
			</ModalContent>
		</Modal>
	)
}
