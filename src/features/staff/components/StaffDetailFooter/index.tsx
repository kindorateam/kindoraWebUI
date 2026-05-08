import { Button } from "@heroui/react"
import { useTranslation } from "react-i18next"

interface StaffDetailFooterProps {
	onDeactivate?: () => void
	onCancel?: () => void
	onSave?: () => void
	isLoading?: boolean
	isDirty?: boolean
}

const StaffDetailFooter = ({
	onDeactivate,
	onCancel,
	onSave,
	isLoading = false,
	isDirty = false,
}: StaffDetailFooterProps) => {
	const { t } = useTranslation()

	return (
		<div className="sticky bottom-0 border-default-200 border-t bg-white py-4">
			<div className="container flex max-w-4xl items-center justify-between">
				<Button onPress={onDeactivate} variant="ghost">
					{t("staff.profile.deactivate.title")}
				</Button>
				<div className="flex gap-3">
					<Button onPress={onCancel} variant="outline">
						{t("common.cancel")}
					</Button>
					<Button variant="primary" isDisabled={!isDirty} isPending={isLoading} onPress={onSave} type="submit">
						{t("staff.profile.saveChanges")}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default StaffDetailFooter
