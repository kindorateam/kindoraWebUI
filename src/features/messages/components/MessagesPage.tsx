import { useMessages } from "../hooks/useMessages"

import MessagesConversationPane from "./MessagesConversationPane"
import MessagesSidebar from "./MessagesSidebar"
import MessagesTabs from "./MessagesTabs"

const MessagesPage = () => {
	const {
		activeTab,
		searchValue,
		selectedThread,
		selectedThreadId,
		setActiveTab,
		setSearchValue,
		setSelectedThreadId,
		visibleThreads,
	} = useMessages()

	return (
		<div className="flex h-[calc(100vh-112px)] flex-col gap-5 px-4 pt-5 pb-4 lg:px-6" data-node-id="2862:22196">
			<MessagesTabs activeTab={activeTab} onSelectionChange={setActiveTab} />

			<div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[318px_minmax(0,1fr)]">
				<MessagesSidebar
					searchValue={searchValue}
					selectedThreadId={selectedThreadId}
					threads={visibleThreads}
					onSearchChange={setSearchValue}
					onThreadSelect={setSelectedThreadId}
				/>
				<MessagesConversationPane thread={selectedThread} />
			</div>
		</div>
	)
}

export default MessagesPage
