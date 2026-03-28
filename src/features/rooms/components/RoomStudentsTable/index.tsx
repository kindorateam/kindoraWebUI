import { Button, EmptyState, Pagination, Spinner, Table } from "@heroui/react"
import { useState } from "react"

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
	const { data: room, isLoading, error, refetch } = useRoom(roomId)
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

	const [page, setPage] = useState(1)
	const pageSize = 10
	const allStudents = room?.signedInStudents ?? []
	const total = allStudents.length
	const totalPages = Math.ceil(total / pageSize) || 1
	const students = allStudents.slice((page - 1) * pageSize, page * pageSize)
	const startItem = (page - 1) * pageSize + 1
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
				Transfer to another Room
			</Button>
			<Button variant="primary" onPress={() => openAddStudentModal(roomId)}>
				<OcticonFeedPlus16 aria-hidden className="size-4" />
				Add Student
			</Button>
		</div>
	)

	return (
		<>
			<div className="flex flex-col gap-4">
				{topContent}
				<Table className="[&_td]:py-1.5! [&_tr]:h-[50px]!">
					<Table.ScrollContainer className="min-h-[560px]">
						<Table.Content
							aria-label="Students table"
							selectionMode="multiple"
							selectedKeys={selectedKeys}
							onSelectionChange={setSelectedKeys}
						>
							<Table.Header>
								{columns.map((column) => (
									<Table.Column
										key={column.key}
										isRowHeader={column.isRowHeader}
										className={column.align === "center" ? "text-center" : undefined}
									>
										{column.label}
									</Table.Column>
								))}
							</Table.Header>
							<Table.Body>
								{isLoading ? (
									<Table.Row>
										<Table.Cell colSpan={columns.length}>
											<EmptyState className="flex h-[524px] w-full items-center justify-center">
												<Spinner />
											</EmptyState>
										</Table.Cell>
									</Table.Row>
								) : error ? (
									<Table.Row>
										<Table.Cell colSpan={columns.length}>
											<TableError onRetry={refetch} />
										</Table.Cell>
									</Table.Row>
								) : students.length === 0 ? (
									<Table.Row>
										<Table.Cell colSpan={columns.length}>
											<EmptyState className="flex h-[524px] w-full items-center justify-center text-default-400">
												No students in this room
											</EmptyState>
										</Table.Cell>
									</Table.Row>
								) : (
									students.map((student) => (
										<Table.Row key={student.id}>
											{columns.map((column) => (
												<Table.Cell key={column.key}>{renderCell(student, column.key, roomId)}</Table.Cell>
											))}
										</Table.Row>
									))
								)}
							</Table.Body>
						</Table.Content>
					</Table.ScrollContainer>
					<Table.Footer>
						<Pagination className="w-full">
							<Pagination.Summary>
								{startItem} to {endItem} of {total} students
							</Pagination.Summary>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.Previous isDisabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
										<Pagination.PreviousIcon />
										<span>Prev</span>
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
										<span>Next</span>
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
