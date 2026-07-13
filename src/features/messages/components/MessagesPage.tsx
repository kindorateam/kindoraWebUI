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
		handleLoadOlderMessages,
		handleLoadMoreConversations,
		handleReconnect,
		handleSendMessage,
		handleThreadSelect,
		handleToggleFavorite,
		hasThreads,
		hasMoreConversations,
		hasOlderMessages,
		isLoadingMessages,
		isLoadingThreads,
		isLoadingMoreConversations,
		isMoreConversationsError,
		isMessagesError,
		isOlderMessagesError,
		isLoadingOlderMessages,
		isMobileConversationOpen,
		isSendingMessage,
		isThreadsError,
		refetchMessages,
		refetchThreads,
		searchValue,
		selectedThread,
		selectedThreadId,
		setActiveTab,
		setSearchValue,
		visibleThreads,
	} = useMessages()

	return (
		<div className="flex h-[calc(100dvh-112px)] min-h-0 flex-col px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
			<div className="grid min-h-0 min-w-0 flex-1 gap-3 overflow-hidden md:grid-cols-[minmax(270px,320px)_minmax(0,1fr)] md:gap-0">
				<MessagesSidebar
					className={clsx(isMobileConversationOpen && "hidden md:flex")}
					hasMore={hasMoreConversations}
					hasThreads={hasThreads}
					isError={isThreadsError}
					isLoading={isLoadingThreads}
					isLoadingMore={isLoadingMoreConversations}
					isLoadMoreError={isMoreConversationsError}
					searchValue={searchValue}
					selectedThreadId={selectedThreadId}
					threads={visibleThreads}
					onSearchChange={setSearchValue}
					onLoadMore={() => void handleLoadMoreConversations()}
					onRetry={() => void refetchThreads()}
					onToggleFavorite={handleToggleFavorite}
					onThreadSelect={handleThreadSelect}
				>
					<MessagesTabs activeTab={activeTab} onSelectionChange={setActiveTab} />
				</MessagesSidebar>
				<MessagesConversationPane
					key={selectedThread?.id ?? "no-conversation"}
					className={clsx(!isMobileConversationOpen && "hidden md:flex")}
					connection={connection}
					hasOlderMessages={hasOlderMessages}
					hasThreads={hasThreads}
					isLoadingMessages={isLoadingMessages}
					isLoadingThreads={isLoadingThreads}
					isMessagesError={isMessagesError}
					isOlderMessagesError={isOlderMessagesError}
					isLoadingOlderMessages={isLoadingOlderMessages}
					isSendingMessage={isSendingMessage}
					showBackButton={isMobileConversationOpen}
					thread={selectedThread}
					onBack={handleBackToList}
					onLoadOlderMessages={handleLoadOlderMessages}
					onReconnect={handleReconnect}
					onRetryMessages={() => void refetchMessages()}
					onSendMessage={handleSendMessage}
				/>
			</div>
		</div>
	)
}

export default MessagesPage
