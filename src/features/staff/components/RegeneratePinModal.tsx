import { Button, Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"

import { useRegenerateEmployeePin } from "../hooks/useStaff"
import { closeRegeneratePinModal, isRegeneratePinModalOpenAtom } from "../stores/regeneratePinModal.store"

interface Props {
	employeeId: string
}

const RegeneratePinModal = ({ employeeId }: Props) => {
	const { t } = useTranslation()
	const isOpen = useAtomValue(isRegeneratePinModalOpenAtom)
	const regenerateMutation = useRegenerateEmployeePin()

	const handleRegenerate = () => {
		regenerateMutation.mutate(
			{ employeeId },
			{
				onSuccess: () => {
					toast(t("staff.regeneratePin.successTitle"), {
						description: t("staff.regeneratePin.successDescription"),
						variant: "success",
					})
					closeRegeneratePinModal()
				},
				onError: (error) => {
					toast(t("staff.regeneratePin.errorTitle"), {
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
				<Modal.Dialog aria-label={t("staff.regeneratePin.title")}>
					<Modal.CloseTrigger />
					<Modal.Body>
						<div className="flex flex-col items-center gap-5">
							<div className="flex flex-col items-center gap-3 text-center">
								<h3 className="font-medium text-xl leading-7">{t("staff.regeneratePin.title")}</h3>
								<p className="text-foreground text-sm leading-5">{t("staff.regeneratePin.description")}</p>
							</div>
							<div className="flex w-full flex-col gap-3">
								<Button
									className="w-full"
									variant="primary"
									isPending={regenerateMutation.isPending}
									onPress={handleRegenerate}
								>
									{t("staff.regeneratePin.confirm")}
								</Button>
								<Button fullWidth isDisabled={regenerateMutation.isPending} slot="close" size="md">
									{t("common.cancel")}
								</Button>
							</div>
						</div>
					</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default RegeneratePinModal
