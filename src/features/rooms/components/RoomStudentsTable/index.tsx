import {
	Button,
	Card,
	CardBody,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react"
import { useState } from "react"

import MageExchangeA from "~icons/mage/exchange-a"
import TablerCirclePlusFilled from "~icons/tabler/circle-plus-filled"

import { useRoom } from "../../hooks/useRooms"
import { openAddStudentModal } from "../../stores/addStudentModal.store"

import columns from "./columns"
import { renderCell } from "./renderCell"

import type { Selection } from "@heroui/react"

interface RoomStudentsTableProps {
	roomId: string
}

const RoomStudentsTable = ({ roomId }: RoomStudentsTableProps) => {
	const { data: room, isLoading, error } = useRoom(roomId)
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

	const students = room?.signedInStudents ?? []
	const hasSelection = selectedKeys === "all" || selectedKeys.size > 0

	return (
		<Card>
			<CardBody className="p-4">
				<Table
					aria-label="Students table"
					removeWrapper
					selectionMode="multiple"
					selectedKeys={selectedKeys}
					onSelectionChange={setSelectedKeys}
					topContent={
						<div className="flex items-center justify-end gap-5">
							<Button
								color="primary"
								variant="bordered"
								isDisabled={!hasSelection}
								endContent={<MageExchangeA className="size-5" />}
								onPress={() => {}}
							>
								Move to another room
							</Button>
							<Button
								color="primary"
								endContent={<TablerCirclePlusFilled className="size-5 text-white" />}
								onPress={openAddStudentModal}
							>
								Add Student
							</Button>
						</div>
					}
					topContentPlacement="outside"
					classNames={{
						tr: "border-b border-default-200 last:border-b-0",
						th: "py-0",
						td: "py-0",
						tbody: "[&>tr]:h-[55px]",
						emptyWrapper: "h-[550px]",
					}}
				>
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn key={column.key} align={column.align}>
								{column.label}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody
						emptyContent={error ? "Failed to load students" : "No students in this room"}
						items={error || isLoading ? [] : students}
						isLoading={isLoading}
						loadingContent={<Spinner size="lg" />}
					>
						{(student) => (
							<TableRow key={student.id}>
								{(columnKey) => <TableCell>{renderCell(student, columnKey)}</TableCell>}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	)
}

export default RoomStudentsTable
