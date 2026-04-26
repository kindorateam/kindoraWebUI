import { Tabs } from "@heroui/react"

import type { MessageTab } from "../types"

interface MessagesTabsProps {
	activeTab: MessageTab
	onSelectionChange: (tab: MessageTab) => void
}

const MessagesTabs = ({ activeTab, onSelectionChange }: MessagesTabsProps) => {
	return (
		<Tabs className="w-full" selectedKey={activeTab} onSelectionChange={(key) => onSelectionChange(key as MessageTab)}>
			<Tabs.ListContainer className="w-full">
				<Tabs.List
					aria-label="Messages tabs"
					className="w-full *:h-6 *:flex-1 *:px-3 *:font-normal *:text-sm *:data-[selected=true]:text-accent-foreground"
				>
					<Tabs.Tab id="all">
						All messages
						<Tabs.Indicator className="bg-accent" />
					</Tabs.Tab>
					<Tabs.Tab id="favorites">
						Favorites
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
