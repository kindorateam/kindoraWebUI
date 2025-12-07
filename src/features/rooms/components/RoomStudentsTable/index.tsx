import { Button, Card, CardBody, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"

import TablerCirclePlusFilled from "~icons/tabler/circle-plus-filled"

import { useRoom } from "../../hooks/useRooms"
import { openAddStudentModal } from "../../stores/addStudentModal.store"

import columns from "./columns"
import { renderCell } from "./renderCell"

interface RoomStudentsTableProps {
	roomId: string
}

const RoomStudentsTable = ({ roomId }: RoomStudentsTableProps) => {
	const { data: room, isLoading, error } = useRoom(roomId)

	const students = room?.signedInStudents ?? []

	return (
		<Card>
			<CardBody className="p-4">
				<Table
					aria-label="Students table"
					removeWrapper
					selectionMode="multiple"
					topContent={
						<div className="flex items-center justify-end gap-5">
							<Button color="primary" variant="bordered" onPress={() => {}}>
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
