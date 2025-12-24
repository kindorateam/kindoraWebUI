import { Button } from "@heroui/react"

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
	return (
		<div className="sticky bottom-0 border-default-200 border-t bg-white py-4">
			<div className="container flex max-w-4xl items-center justify-between">
				<Button color="danger" onPress={onDeactivate} variant="light">
					Deactivate Account
				</Button>
				<div className="flex gap-3">
					<Button color="default" onPress={onCancel} variant="bordered">
						Cancel
					</Button>
					<Button color="primary" isDisabled={!isDirty} isLoading={isLoading} onPress={onSave} type="submit">
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	)
}

export default StaffDetailFooter
