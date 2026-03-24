import { Tabs } from "@heroui/react"

import type { MessageTab } from "../types"

interface MessagesTabsProps {
	activeTab: MessageTab
	onSelectionChange: (tab: MessageTab) => void
}

const MessagesTabs = ({ activeTab, onSelectionChange }: MessagesTabsProps) => {
	return (
		<Tabs
			className="w-full max-w-[316px]"
			selectedKey={activeTab}
			onSelectionChange={(key) => onSelectionChange(key as MessageTab)}
		>
			<Tabs.ListContainer>
				<Tabs.List
					aria-label="Messages tabs"
					className="h-8 gap-2 rounded-xl bg-white p-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"
				>
					<Tabs.Tab
						id="all"
						className="h-6 rounded-lg px-3 text-[12px] leading-4 text-[#71717a] data-[selected]:text-white"
					>
						All messages
						<Tabs.Indicator className="rounded-lg bg-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
					</Tabs.Tab>
					<Tabs.Tab
						id="favorites"
						className="h-6 rounded-lg px-3 text-[12px] leading-4 text-[#71717a] data-[selected]:text-white"
					>
						Favorites
						<Tabs.Indicator className="rounded-lg bg-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
					</Tabs.Tab>
				</Tabs.List>
			</Tabs.ListContainer>
			<Tabs.Panel id="all" >{null}</Tabs.Panel>
			<Tabs.Panel id="favorites" >{null}</Tabs.Panel>
		</Tabs>
	)
}

export default MessagesTabs
