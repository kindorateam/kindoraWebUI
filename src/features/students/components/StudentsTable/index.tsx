import { Button, Card, Spinner, Table } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import TableError from "@/components/TableError"

import { useStudents } from "../../hooks/useStudents"
import StudentsEmptyState from "../StudentsEmptyState"

import columns from "./columns"
import StudentsTableCell from "./StudentsTableCell"

const StudentsTable = () => {
	const navigate = useNavigate()
	const [page, setPage] = useState(1)
	const { students, total, totalPages, isLoading, error, refetch } = useStudents({ page })

	const handleStudentClick = (studentId: string) => {
		void navigate({
			to: "/students/$studentId",
			params: { studentId },
			search: { tab: "activity" },
		})
	}

	const topContent = (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-end">
				<Button variant="primary">Add Student</Button>
			</div>
			<span className="text-default-400 text-sm">Total {total} students</span>
		</div>
	)

	return (
		<Card>
			<Card.Content className="flex flex-col gap-4 p-4">
				{topContent}
				<div className="flex min-h-[647.5px] flex-col justify-between">
					<Table.ScrollContainer>
						<Table.Content
							aria-label="Students table"
							className="[&_tbody>tr:last-child]:border-b-0 [&_tbody>tr]:h-13.75 [&_tbody>tr]:border-default-200 [&_tbody>tr]:border-b [&_td]:py-0 [&_th]:py-0"
						>
							<Table.Header>
								{columns.map((column) => (
									<Table.Column
										key={column.key}
										isRowHeader={column.isRowHeader}
										className={column.align === "center" ? "text-center" : ""}
									>
										{column.label}
									</Table.Column>
								))}
							</Table.Header>
							<Table.Body>
								{isLoading ? (
									<Table.Row>
										<Table.Cell colSpan={columns.length}>
											<div className="flex justify-center py-8">
												<Spinner size="lg" />
											</div>
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
											<StudentsEmptyState />
										</Table.Cell>
									</Table.Row>
								) : (
									students.map((student) => (
										<Table.Row key={student.id}>
											{columns.map((column) => (
												<Table.Cell key={column.key}>
													<StudentsTableCell
														columnKey={column.key}
														onStudentClick={handleStudentClick}
														student={student}
													/>
												</Table.Cell>
											))}
										</Table.Row>
									))
								)}
							</Table.Body>
						</Table.Content>
					</Table.ScrollContainer>
					{totalPages > 1 && (
						<div className="flex w-full justify-center pt-4">
							<div className="flex items-center gap-2">
								<Button size="sm" variant="outline" isDisabled={page <= 1} onPress={() => setPage(page - 1)}>
									Prev
								</Button>
								<span className="text-sm">
									Page {page} of {totalPages}
								</span>
								<Button size="sm" variant="outline" isDisabled={page >= totalPages} onPress={() => setPage(page + 1)}>
									Next
								</Button>
							</div>
						</div>
					)}
				</div>
			</Card.Content>
		</Card>
	)
}

export default StudentsTable
