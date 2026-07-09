import { Button } from "@heroui/react"
import { useTranslation } from "react-i18next"

import CiSave from "~icons/ci/save"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"

interface StaffProfileActionsProps {
	hasChanges: boolean
	isSaving: boolean
	isValid: boolean
	onCancel: () => void
	onDeactivate: () => void
}

const StaffProfileActions = ({ hasChanges, isSaving, isValid, onCancel, onDeactivate }: StaffProfileActionsProps) => {
	const { t } = useTranslation()

	return (
		<div className="flex items-center gap-5">
			<Button className="mr-auto text-xs shadow-sm" onPress={onDeactivate} size="md" type="button" variant="danger">
				<MaterialSymbolsDeleteOutline aria-hidden className="size-4" />
				{t("staff.profile.deactivate.title")}
			</Button>
			<Button isDisabled={isSaving} onPress={onCancel} size="md" type="button" variant="outline">
				{t("common.cancel")}
			</Button>
			<Button isDisabled={!hasChanges || !isValid} isPending={isSaving} size="md" type="submit" variant="primary">
				<CiSave aria-hidden className="size-4" />
				{t("staff.profile.saveChanges")}
			</Button>
		</div>
	)
}

export default StaffProfileActions
