import { useTranslation } from "react-i18next"

interface AddStaffStepHeaderProps {
	icon: React.ReactNode
	title: string
}

const AddStaffStepHeader = ({ icon, title }: AddStaffStepHeaderProps) => {
	const { t } = useTranslation()

	return (
		<div className="flex items-center justify-between">
			<h2 className="font-medium text-xl">{t("staff.addStaff.title")}</h2>
			<div className="flex items-center gap-2.5 py-1.5">
				{icon}
				<span className="font-semibold text-foreground text-sm">{title}</span>
			</div>
		</div>
	)
}

export default AddStaffStepHeader
