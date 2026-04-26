import { Button, Input, Label, TextField } from "@heroui/react"
import clsx from "clsx"

import TablerLink from "~icons/tabler/link"

import ThreadCard from "./ThreadCard"

import type { ThreadItem } from "../types"

interface MessagesSidebarProps {
	children?: React.ReactNode
	className?: string
	searchValue: string
	selectedThreadId?: string
	threads: ThreadItem[]
	onSearchChange: (value: string) => void
	onToggleFavorite: (threadId: string) => void
	onThreadSelect: (threadId: string) => void
}

const MessagesSidebar = ({
	children,
	className,
	searchValue,
	selectedThreadId,
	threads,
	onSearchChange,
	onToggleFavorite,
	onThreadSelect,
}: MessagesSidebarProps) => {
	return (
		<section className={clsx("min-h-0 overflow-hidden", className)}>
			<div className="flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-default-200 bg-content1 p-3">
				{children}

				<div className="flex items-end gap-2">
					<TextField className="flex-1">
						<Label>Search chat</Label>

						<Input
							aria-label="Search chat"
							placeholder="Search by family or student name"
							value={searchValue}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
						/>
					</TextField>
					<Button aria-label="Conversation link" isIconOnly variant="ghost">
						<TablerLink className="size-5" />
					</Button>
				</div>

				<div className="messages-thread-scroll min-h-0 flex-1 overflow-y-auto">
					<div className="flex min-h-full flex-col gap-1">
						{threads.length > 0 ? (
							threads.map((item) => (
								<ThreadCard
									key={item.id}
									isSelected={selectedThreadId === item.id}
									item={item}
									onToggleFavorite={onToggleFavorite}
									onPress={onThreadSelect}
								/>
							))
						) : (
							<div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
								<p className="font-medium text-foreground">No conversations found</p>
								<p className="mt-1 text-default-500 text-sm">Try a different name or switch tabs.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}

export default MessagesSidebar
