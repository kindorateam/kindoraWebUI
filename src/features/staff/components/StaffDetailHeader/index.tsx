import { useTranslation } from "react-i18next"

import { getEmployeeAvatarUrl, getEmployeeFullName } from "../../types"

import StaffAbsencePicker from "./StaffAbsencePicker"
import StaffDetailTabs from "./StaffDetailTabs"
import StaffHeaderSummary from "./StaffHeaderSummary"

import type { EmployeeFull } from "../../types"
import type { StaffDetailTab } from "./StaffDetailTabs"

interface StaffDetailHeaderProps {
	activeTab: StaffDetailTab
	employeeData: EmployeeFull | undefined
	onGeneratePin?: () => void
	onSendInvite?: () => void
	onSignOut?: () => void
	onTabChange: (tab: StaffDetailTab) => void
}

const StaffDetailHeader = ({
	employeeData,
	activeTab,
	onTabChange,
	onSignOut,
	onGeneratePin,
	onSendInvite,
}: StaffDetailHeaderProps) => {
	const { t } = useTranslation()
	const fullName = employeeData ? getEmployeeFullName(employeeData) : t("staff.detail.fallbackEmployee")
	const avatarUrl = employeeData ? getEmployeeAvatarUrl(employeeData) : undefined
	// TODO: Replace the mock absence range with employee absence data from the API.
	const absenceDate = "Nov 20 - Nov 26"

	return (
		<div className="container mx-auto max-w-4xl">
			<StaffHeaderSummary
				avatarUrl={avatarUrl}
				employee={employeeData}
				fullName={fullName}
				onGeneratePin={onGeneratePin}
				onSendInvite={onSendInvite}
				onSignOut={onSignOut}
			>
				<StaffAbsencePicker absenceDate={absenceDate} />
			</StaffHeaderSummary>
			<StaffDetailTabs activeTab={activeTab} onTabChange={onTabChange} />
		</div>
	)
}

export default StaffDetailHeader
