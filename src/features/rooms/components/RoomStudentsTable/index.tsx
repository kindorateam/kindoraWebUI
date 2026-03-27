import { Button, Card, Spinner, Table } from "@heroui/react"
import { useState } from "react"

import TableError from "@/components/TableError"

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

	const students = room?.signedInStudents ?? []
	const hasSelection = selectedKeys === "all" || selectedKeys.size > 0

	const getSelectedStudentIds = (): string[] => {
		if (selectedKeys === "all") {
			return students.map((s) => s.id)
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
				Transfer to another Room
			</Button>
			<Button variant="primary" onPress={() => openAddStudentModal(roomId)}>
				Add Student
			</Button>
		</div>
	)

	return (
		<>
			<Card>
				<Card.Content className="flex flex-col gap-4 p-4">
					{topContent}
					<Table.ScrollContainer>
						<Table.Content
							aria-label="Students table"
							selectionMode="multiple"
							selectedKeys={selectedKeys}
							onSelectionChange={setSelectedKeys}
							className="min-h-[595.5px] [&_tbody>tr:last-child]:border-b-0 [&_tbody>tr]:h-[55px] [&_tbody>tr]:border-default-200 [&_tbody>tr]:border-b [&_td:first-child]:w-8 [&_td:first-child]:pe-0 [&_td:first-child]:text-center [&_td]:py-0 [&_th:first-child]:w-8 [&_th:first-child]:pe-0 [&_th:first-child]:text-center [&_th]:py-0"
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
										<Table.Cell colSpan={columns.length} className="h-[550px] text-center">
											<Spinner size="lg" />
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
										<Table.Cell colSpan={columns.length} className="h-[550px] text-center text-default-400">
											No students in this room
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
				</Card.Content>
			</Card>
			<AddStudentModal />
			<MarkAbsentModal />
			<TransferStudentModal onSuccess={() => setSelectedKeys(new Set([]))} />
		</>
	)
}

export default RoomStudentsTable
