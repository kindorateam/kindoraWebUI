import { Tabs } from "@heroui/react"
import { useTranslation } from "react-i18next"

import type { MessageTab } from "../types"

interface MessagesTabsProps {
	activeTab: MessageTab
	onSelectionChange: (tab: MessageTab) => void
}

const MessagesTabs = ({ activeTab, onSelectionChange }: MessagesTabsProps) => {
	const { t } = useTranslation()

	return (
		<Tabs
			className="w-full min-w-0 overflow-hidden"
			selectedKey={activeTab}
			onSelectionChange={(key) => onSelectionChange(key as MessageTab)}
		>
			<Tabs.ListContainer className="w-full min-w-0">
				<Tabs.List
					aria-label={t("messages.tabs.ariaLabel")}
					className="w-full min-w-0 *:h-6 *:min-w-0 *:flex-1 *:px-3 *:font-normal *:text-sm *:data-[selected=true]:text-accent-foreground"
				>
					<Tabs.Tab id="all">
						{t("messages.tabs.all")}
						<Tabs.Indicator className="bg-accent" />
					</Tabs.Tab>
					<Tabs.Tab id="favorites">
						{t("messages.tabs.favorites")}
						<Tabs.Indicator className="bg-accent" />
					</Tabs.Tab>
				</Tabs.List>
			</Tabs.ListContainer>
			<Tabs.Panel id="all" className="hidden">
				{null}
			</Tabs.Panel>
			<Tabs.Panel id="favorites" className="hidden">
				{null}
			</Tabs.Panel>
		</Tabs>
	)
}

export default MessagesTabs
