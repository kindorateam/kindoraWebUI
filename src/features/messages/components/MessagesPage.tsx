import {
	Avatar,
	Card,
	CardBody,
	Pagination,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react"
import { useState } from "react"

import SubHeader from "@/components/SubHeader"
import TablerChevronDown from "~icons/tabler/chevron-down"

import { MESSAGES, MESSAGE_PAGE_SIZE, ROOM_OPTIONS, STUDENT_OPTIONS } from "../constants"

import FilterSelect from "./FilterSelect"
import ParentsAvatarGroup from "./ParentsAvatarGroup"

export default function MessagesPage() {
	const [selectedRoomId, setSelectedRoomId] = useState("all")
	const [selectedStudentId, setSelectedStudentId] = useState("all")
	const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(new Set())
	const [page, setPage] = useState(1)

	const filteredMessages = MESSAGES.filter((message) => {
		const matchesRoom = selectedRoomId === "all" || message.roomId === selectedRoomId
		const matchesStudent = selectedStudentId === "all" || message.studentId === selectedStudentId

		return matchesRoom && matchesStudent
	})

	const totalPages = Math.max(1, Math.ceil(filteredMessages.length / MESSAGE_PAGE_SIZE))
	const currentPage = Math.min(page, totalPages)
	const pageStart = (currentPage - 1) * MESSAGE_PAGE_SIZE
	const pageMessages = filteredMessages.slice(pageStart, pageStart + MESSAGE_PAGE_SIZE)

	const resetTableState = () => {
		setPage(1)
		setSelectedMessageIds(new Set())
	}

	const handleRoomChange = (value: string) => {
		setSelectedRoomId(value)
		resetTableState()
	}

	const handleStudentChange = (value: string) => {
		setSelectedStudentId(value)
		resetTableState()
	}

	const handleSelectionChange = (keys: "all" | Set<string | number>) => {
		if (keys === "all") {
			setSelectedMessageIds(new Set(pageMessages.map((message) => message.id)))
			return
		}

		setSelectedMessageIds(new Set(Array.from(keys, (key) => String(key))))
	}

	return (
		<div>
			<SubHeader
				title={
					<span className="flex items-center gap-3">
						<span>Messages</span>
						<span className="pt-1 font-medium text-base text-default-400">{filteredMessages.length}</span>
					</span>
				}
			/>

			<div className="container mx-auto max-w-4xl px-4 pt-8 pb-8">
				<Card className="overflow-hidden border border-default-100 shadow-sm">
					<CardBody className="p-2 sm:p-4">
						<div className="flex flex-col gap-3">
							<div className="grid gap-3 md:grid-cols-2">
								<FilterSelect
									label="Room"
									onChange={handleRoomChange}
									options={ROOM_OPTIONS}
									selectedKey={selectedRoomId}
								/>
								<FilterSelect
									label="Student"
									onChange={handleStudentChange}
									options={STUDENT_OPTIONS}
									selectedKey={selectedStudentId}
								/>
							</div>

							<div className="overflow-x-auto">
								<Table
									aria-label="Messages table"
									onSelectionChange={handleSelectionChange}
									removeWrapper
									selectedKeys={Array.from(selectedMessageIds)}
									selectionBehavior="toggle"
									selectionMode="multiple"
									showSelectionCheckboxes
									classNames={{
										base: "min-h-[595.5px]",
										table: "min-w-[720px]",
										th: "bg-default-100 py-3 text-xs font-medium text-default-500 first:rounded-l-xl last:rounded-r-xl",
										td: "py-0 data-[selected=true]:bg-primary-50/70",
										tr: "border-b border-default-100 last:border-b-0",
										tbody: "[&>tr]:h-[55px]",
										emptyWrapper: "h-[550px]",
									}}
								>
									<TableHeader>
										<TableColumn>
											<div className="flex items-center gap-1">
												<span>Students</span>
												<TablerChevronDown className="size-3.5 text-default-400" />
											</div>
										</TableColumn>
										<TableColumn>Parents</TableColumn>
										<TableColumn>Messages</TableColumn>
										<TableColumn align="end">Time</TableColumn>
									</TableHeader>
									<TableBody
										emptyContent={<div className="text-default-400 text-sm">No messages found.</div>}
										items={pageMessages}
									>
										{(message) => (
											<TableRow key={message.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar
															color="primary"
															name={message.studentName}
															showFallback
															size="sm"
															src={message.studentAvatar}
														/>
														<span className="whitespace-nowrap font-medium text-foreground text-sm">
															{message.studentName}
														</span>
													</div>
												</TableCell>
												<TableCell>
													<ParentsAvatarGroup parents={message.parents} />
												</TableCell>
												<TableCell>
													<p className="max-w-[360px] truncate text-default-500 text-sm">{message.preview}</p>
												</TableCell>
												<TableCell className="text-right text-default-500 text-sm">{message.time}</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>

							{totalPages > 1 && (
								<div className="mt-auto flex w-full justify-center">
									<Pagination
										isCompact
										showControls
										showShadow
										color="primary"
										page={currentPage}
										total={totalPages}
										onChange={setPage}
									/>
								</div>
							)}
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	)
}
