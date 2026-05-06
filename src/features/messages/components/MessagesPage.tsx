import clsx from "clsx"

import { useMessages } from "../hooks/useMessages"

import MessagesConversationPane from "./MessagesConversationPane"
import MessagesSidebar from "./MessagesSidebar"
import MessagesTabs from "./MessagesTabs"

const MessagesPage = () => {
	const {
		activeTab,
		connection,
		handleBackToList,
		handleReconnect,
		handleThreadSelect,
		handleToggleFavorite,
		hasThreads,
		isMobileConversationOpen,
		searchValue,
		selectedThread,
		selectedThreadId,
		setActiveTab,
		setSearchValue,
		visibleThreads,
	} = useMessages()

	return (
		<div className="flex h-[calc(100vh-112px)] min-h-0 flex-col gap-4 bg-default-50/40 px-4 py-4 lg:px-6">
			<div className="grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[320px_minmax(0,1fr)]">
				<MessagesSidebar
					className={clsx(isMobileConversationOpen && "hidden lg:flex")}
					hasThreads={hasThreads}
					searchValue={searchValue}
					selectedThreadId={selectedThreadId}
					threads={visibleThreads}
					onSearchChange={setSearchValue}
					onToggleFavorite={handleToggleFavorite}
					onThreadSelect={handleThreadSelect}
				>
					<MessagesTabs activeTab={activeTab} onSelectionChange={setActiveTab} />
				</MessagesSidebar>
				<MessagesConversationPane
					className={clsx(!isMobileConversationOpen && "hidden lg:flex")}
					connection={connection}
					hasThreads={hasThreads}
					showBackButton={isMobileConversationOpen}
					thread={selectedThread}
					onBack={handleBackToList}
					onReconnect={handleReconnect}
				/>
			</div>
		</div>
	)
}

export default MessagesPage
