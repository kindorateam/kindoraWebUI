import { Button, Checkbox, EmptyState, Pagination, Spinner, Table } from "@heroui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import TableError from "@/components/TableError"
import MageExchangeA from "~icons/mage/exchange-a"
import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"

import { useRoom } from "../../hooks/useRooms"
import { openAddStudentModal } from "../../stores/addStudentModal.store"
import { openTransferStudentModal } from "../../stores/transferStudentModal.store"
import AddStudentModal from "../AddStudentModal"
import MarkAbsentModal from "../MarkAbsentModal"
import TransferStudentModal from "../TransferStudentModal"

import columns from "./columns"
import { renderCell } from "./renderCell"

import type { Selection } from "@heroui/react"

interface RoomStudentsTableProps {
	roomId: string
}

const RoomStudentsTable = ({ roomId }: RoomStudentsTableProps) => {
	const { i18n, t } = useTranslation()
	const { data: room, isLoading, error, refetch } = useRoom(roomId)
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

	const [page, setPage] = useState(1)
	const pageSize = 10
	const allStudents = room?.signedInStudents ?? []
	const total = allStudents.length
	const totalPages = Math.ceil(total / pageSize) || 1
	const students = allStudents.slice((page - 1) * pageSize, page * pageSize)
	const hasError = Boolean(error)
	const showLoading = isLoading
	const isEmpty = !showLoading && !hasError && students.length === 0
	const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1
	const endItem = Math.min(page * pageSize, total)
	const hasSelection = selectedKeys === "all" || selectedKeys.size > 0

	const getSelectedStudentIds = (): string[] => {
		if (selectedKeys === "all") {
			return allStudents.map((s) => s.id)
		}
		return Array.from(selectedKeys) as string[]
	}

	const handleTransfer = () => {
		const studentIds = getSelectedStudentIds()
		if (studentIds.length > 0) {
			openTransferStudentModal(roomId, studentIds)
		}
	}

	const topContent = (
		<div className="flex items-center justify-end gap-5">
			<Button variant="outline" size="md" isDisabled={!hasSelection} onPress={handleTransfer}>
				<MageExchangeA aria-hidden className="size-4" />
				{t("rooms.studentsTable.transferToRoom")}
			</Button>
			<Button variant="primary" onPress={() => openAddStudentModal(roomId)}>
				<OcticonFeedPlus16 aria-hidden className="size-4" />
				{t("rooms.studentsTable.addStudent")}
			</Button>
		</div>
	)

	return (
		<>
			<div className="flex flex-col gap-4">
				{topContent}
				<Table className="[&_td]:py-1.5! [&_tr]:h-12.5!">
					<div className="relative">
						<Table.ScrollContainer className="min-h-140">
							<Table.Content
								key={i18n.language}
								aria-label={t("rooms.studentsTable.ariaLabel")}
								selectionMode="multiple"
								selectedKeys={selectedKeys}
								onSelectionChange={setSelectedKeys}
							>
								<Table.Header>
									<Table.Column className="pr-0">
										<Checkbox aria-label={t("rooms.studentsTable.selectAll")} slot="selection">
											<Checkbox.Control>
												<Checkbox.Indicator />
											</Checkbox.Control>
										</Checkbox>
									</Table.Column>
									{columns.map((column) => (
										<Table.Column
											key={column.key}
											isRowHeader={column.isRowHeader}
											className={column.align === "center" ? "text-center" : undefined}
										>
											{t(column.labelKey)}
										</Table.Column>
									))}
								</Table.Header>
								{showLoading || isEmpty || hasError ? (
									<Table.Body />
								) : (
									<Table.Body items={students}>
										{(student) => (
											<Table.Row id={student.id}>
												<Table.Cell className="pr-0">
													<Checkbox
														aria-label={t("rooms.studentsTable.selectStudent", { name: student.name })}
														slot="selection"
														variant="secondary"
													>
														<Checkbox.Control>
															<Checkbox.Indicator />
														</Checkbox.Control>
													</Checkbox>
												</Table.Cell>
												<Table.Collection items={columns}>
													{(column) => <Table.Cell>{renderCell(student, column.key, roomId, t)}</Table.Cell>}
												</Table.Collection>
											</Table.Row>
										)}
									</Table.Body>
								)}
							</Table.Content>
						</Table.ScrollContainer>
						{showLoading && (
							<div className="pointer-events-none absolute inset-x-0 top-12.5 bottom-0 flex items-center justify-center rounded-[calc(var(--radius)*2)] bg-white">
								<Spinner />
							</div>
						)}
						{isEmpty && (
							<div className="absolute inset-x-0 top-12.5 bottom-0 rounded-[calc(var(--radius)*2)] bg-white">
								<EmptyState className="flex h-full w-full items-center justify-center text-default-400">
									{t("rooms.studentsTable.empty")}
								</EmptyState>
							</div>
						)}
						{hasError && (
							<div className="absolute inset-x-0 top-12.5 bottom-0 rounded-[calc(var(--radius)*2)] bg-white">
								<div className="flex h-full items-center justify-center px-4 py-8">
									<TableError onRetry={refetch} />
								</div>
							</div>
						)}
					</div>
					<Table.Footer>
						<Pagination className="w-full">
							<Pagination.Summary>
								{t("rooms.studentsTable.paginationSummary", { count: total, endItem, startItem, total })}
							</Pagination.Summary>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.Previous isDisabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
										<Pagination.PreviousIcon />
										<span>{t("common.previous")}</span>
									</Pagination.Previous>
								</Pagination.Item>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
									<Pagination.Item key={p}>
										<Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
											{p}
										</Pagination.Link>
									</Pagination.Item>
								))}
								<Pagination.Item>
									<Pagination.Next isDisabled={page >= totalPages} onPress={() => setPage((p) => p + 1)}>
										<span>{t("common.next")}</span>
										<Pagination.NextIcon />
									</Pagination.Next>
								</Pagination.Item>
							</Pagination.Content>
						</Pagination>
					</Table.Footer>
				</Table>
			</div>
			<AddStudentModal />
			<MarkAbsentModal />
			<TransferStudentModal onSuccess={() => setSelectedKeys(new Set([]))} />
		</>
	)
}

export default RoomStudentsTable
