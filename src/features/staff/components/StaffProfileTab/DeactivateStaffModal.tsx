import { Button, Modal } from "@heroui/react"
import { useTranslation } from "react-i18next"

import TablerAlertTriangle from "~icons/tabler/alert-triangle"

interface DeactivateStaffModalProps {
	isOpen: boolean
	onClose: () => void
}

const DeactivateStaffModal = ({ isOpen, onClose }: DeactivateStaffModalProps) => {
	const { t } = useTranslation()

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Icon className="bg-danger-soft text-danger-soft-foreground">
							<TablerAlertTriangle className="size-5" />
						</Modal.Icon>
						<Modal.Heading>{t("staff.profile.deactivate.title")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body>
						<p>{t("staff.profile.deactivate.description")}</p>
					</Modal.Body>
					<Modal.Footer>
						<Button slot="close" variant="secondary">
							{t("common.cancel")}
						</Button>
						<Button onPress={onClose} variant="danger">
							{t("staff.profile.deactivate.confirm")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default DeactivateStaffModal
