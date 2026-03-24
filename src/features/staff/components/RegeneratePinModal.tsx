import { Button, Modal, toast } from "@heroui/react"
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
					toast("PIN regenerated", {
						description: "A new PIN has been generated successfully.",
						variant: "success",
					})
					closeRegeneratePinModal()
				},
				onError: (error) => {
					toast("Failed to regenerate PIN", {
						description: getErrorMessage(error),
						variant: "danger",
					})
				},
			},
		)
	}

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && closeRegeneratePinModal()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Body>
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
									variant="primary"
									isPending={regenerateMutation.isPending}
									onPress={handleRegenerate}
								>
									Regenerate
								</Button>
								<Button fullWidth isDisabled={regenerateMutation.isPending} slot="close" size="md">
									Cancel
								</Button>
							</div>
						</div>
					</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}
