import { Button, Input, Label, TextField } from "@heroui/react"

import TablerLink from "~icons/tabler/link"

import ThreadCard from "./ThreadCard"

import type { ThreadItem } from "../types"

interface MessagesSidebarProps {
	searchValue: string
	selectedThreadId?: string
	threads: ThreadItem[]
	onSearchChange: (value: string) => void
	onThreadSelect: (threadId: string) => void
}

const MessagesSidebar = ({
	searchValue,
	selectedThreadId,
	threads,
	onSearchChange,
	onThreadSelect,
}: MessagesSidebarProps) => {
	return (
		<div className="min-h-0 overflow-hidden">
			<div className="flex h-full min-h-0 flex-col overflow-hidden">
				<div className="flex items-center gap-2">
					<div className="relative flex-1">
						<TextField className="w-full">
							<Label>Search chat</Label>

							<Input
								placeholder="Search chat"
								value={searchValue}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
							/>
						</TextField>
					</div>
					<Button
						isIconOnly
						className="h-[46px] min-w-[46px] rounded-xl bg-default-100 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
						variant="ghost"
					>
						<TablerLink className="size-7 text-[#8d8d93]" />
					</Button>
				</div>

				<div className="messages-thread-scroll mt-2 min-h-0 flex-1 overflow-y-auto">
					<div className="flex flex-col gap-1">
						{threads.map((item) => (
							<ThreadCard
								key={item.id}
								isSelected={selectedThreadId === item.id}
								item={item}
								onPress={onThreadSelect}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default MessagesSidebar
