import { Button, Pagination, Spinner, Table } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import TableError from "@/components/TableError"

import { useStudents } from "../../hooks/useStudents"
import StudentsEmptyState from "../StudentsEmptyState"

import columns from "./columns"
import StudentsTableCell from "./StudentsTableCell"

const PAGE_SIZE = 10

const StudentsTable = () => {
	const navigate = useNavigate()
	const [page, setPage] = useState(1)
	const { students, total, totalPages, isLoading, error, refetch } = useStudents({ page, limit: PAGE_SIZE })

	const startItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
	const endItem = Math.min(page * PAGE_SIZE, total)
	const hasError = Boolean(error)
	const showLoading = isLoading
	const isEmpty = !showLoading && !hasError && students.length === 0

	const handleStudentClick = (studentId: string) => {
		void navigate({
			to: "/students/$studentId",
			params: { studentId },
			search: { tab: "activity" },
		})
	}

	const topContent = (
		<div className="flex items-center justify-end">
			<Button variant="primary">Add Student</Button>
		</div>
	)

	return (
		<div className="flex flex-col gap-4">
			{topContent}
			<div className="flex flex-col justify-between">
				<Table className="[&_td]:py-1.5! [&_tr]:h-12.5!">
					<div className="relative">
						<Table.ScrollContainer className="min-h-140">
							<Table.Content
								aria-label="Students table"
								className="[&_tbody>tr:last-child]:border-b-0 [&_tbody>tr]:border-default-200 [&_tbody>tr]:border-b"
							>
								<Table.Header columns={columns}>
									{(column) => (
										<Table.Column
											isRowHeader={column.isRowHeader}
											className={column.align === "center" ? "text-center" : undefined}
										>
											{column.label}
										</Table.Column>
									)}
								</Table.Header>
								{showLoading || hasError || isEmpty ? (
									<Table.Body />
								) : (
									<Table.Body items={students}>
										{(student) => (
											<Table.Row id={student.id}>
												<Table.Collection items={columns}>
													{(column) => (
														<Table.Cell>
															<StudentsTableCell
																columnKey={column.key}
																onStudentClick={handleStudentClick}
																student={student}
															/>
														</Table.Cell>
													)}
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
						{hasError && (
							<div className="absolute inset-x-0 top-12.5 bottom-0 rounded-[calc(var(--radius)*2)] bg-white">
								<div className="flex h-full items-center justify-center px-4 py-8">
									<TableError onRetry={refetch} />
								</div>
							</div>
						)}
						{isEmpty && (
							<div className="absolute inset-x-0 top-12.5 bottom-0 rounded-[calc(var(--radius)*2)] bg-white">
								<StudentsEmptyState />
							</div>
						)}
					</div>
					<Table.Footer>
						<Pagination className="w-full">
							<Pagination.Summary>
								{startItem} to {endItem} of {total} students
							</Pagination.Summary>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.Previous isDisabled={page <= 1} onPress={() => setPage((currentPage) => currentPage - 1)}>
										<Pagination.PreviousIcon />
										<span>Prev</span>
									</Pagination.Previous>
								</Pagination.Item>
								{Array.from({ length: totalPages }, (_, index) => index + 1).map((paginationPage) => (
									<Pagination.Item key={paginationPage}>
										<Pagination.Link isActive={paginationPage === page} onPress={() => setPage(paginationPage)}>
											{paginationPage}
										</Pagination.Link>
									</Pagination.Item>
								))}
								<Pagination.Item>
									<Pagination.Next
										isDisabled={page >= totalPages}
										onPress={() => setPage((currentPage) => currentPage + 1)}
									>
										<span>Next</span>
										<Pagination.NextIcon />
									</Pagination.Next>
								</Pagination.Item>
							</Pagination.Content>
						</Pagination>
					</Table.Footer>
				</Table>
			</div>
		</div>
	)
}

export default StudentsTable
