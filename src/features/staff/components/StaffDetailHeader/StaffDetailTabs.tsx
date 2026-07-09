import { Tabs } from "@heroui/react"
import { useTranslation } from "react-i18next"

export type StaffDetailTab = "profile" | "documents"

interface StaffDetailTabsProps {
	activeTab: StaffDetailTab
	onTabChange: (tab: StaffDetailTab) => void
}

const StaffDetailTabs = ({ activeTab, onTabChange }: StaffDetailTabsProps) => {
	const { t } = useTranslation()

	return (
		<Tabs onSelectionChange={(key) => onTabChange(key as StaffDetailTab)} selectedKey={activeTab}>
			<Tabs.ListContainer>
				<Tabs.List
					aria-label={t("staff.detail.tabsAriaLabel")}
					className="w-fit *:h-6 *:w-fit *:px-3 *:font-normal *:text-sm *:data-[selected=true]:text-accent-foreground"
				>
					<Tabs.Tab id="profile">
						{t("staff.detail.tabs.profile")}
						<Tabs.Indicator className="bg-accent" />
					</Tabs.Tab>
					<Tabs.Tab id="documents">
						{t("staff.detail.tabs.documents")}
						<Tabs.Indicator className="bg-accent" />
					</Tabs.Tab>
				</Tabs.List>
			</Tabs.ListContainer>
			<Tabs.Panel className="hidden" id="profile">
				{null}
			</Tabs.Panel>
			<Tabs.Panel className="hidden" id="documents">
				{null}
			</Tabs.Panel>
		</Tabs>
	)
}

export default StaffDetailTabs
