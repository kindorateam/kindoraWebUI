import { Tab, Tabs } from "@heroui/react"

import type { MessageTab } from "../types"

interface MessagesTabsProps {
	activeTab: MessageTab
	onSelectionChange: (tab: MessageTab) => void
}

const MessagesTabs = ({ activeTab, onSelectionChange }: MessagesTabsProps) => {
	return (
		<Tabs
			aria-label="Messages tabs"
			classNames={{
				base: "w-full max-w-[316px]",
				tabList:
					"h-8 gap-2 rounded-xl bg-white p-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]",
				tab: "h-6 rounded-lg px-3",
				cursor: "rounded-lg bg-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
				tabContent: "text-[12px] leading-4 text-[#71717a] group-data-[selected=true]:text-white",
			}}
			color="primary"
			radius="lg"
			selectedKey={activeTab}
			variant="light"
			onSelectionChange={(key) => onSelectionChange(key as MessageTab)}
		>
			<Tab key="all" title="All messages" />
			<Tab key="favorites" title="Favorites" />
		</Tabs>
	)
}

export default MessagesTabs
