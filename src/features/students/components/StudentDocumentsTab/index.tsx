import { Button, Card, Spinner, Table } from "@heroui/react"
import { useState } from "react"

import TableError from "@/components/TableError"

import { useStudentDocuments } from "../../hooks/useStudents"
import { openAddDocumentModal } from "../../stores/addDocumentModal.store"
import AddDocumentModal from "../AddDocumentModal"
import DeleteDocumentModal from "../DeleteDocumentModal"

import columns from "./columns"
import { renderCell } from "./renderCell"

interface StudentDocumentsTabProps {
	studentId: string
}

const rowsPerPage = 10

const StudentDocumentsTab = ({ studentId }: StudentDocumentsTabProps) => {
	const { data: documents = [], isLoading, error, refetch } = useStudentDocuments(studentId)
	const [page, setPage] = useState(1)

	const pages = Math.ceil(documents.length / rowsPerPage) || 1

	const start = (page - 1) * rowsPerPage
	const end = start + rowsPerPage
	const items = documents.slice(start, end)

	return (
		<>
			<Card>
				<Card.Content className="flex flex-col gap-4 p-4">
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-end">
							<Button variant="primary" onPress={openAddDocumentModal}>
								Add Document
							</Button>
						</div>
						<span className="text-default-400 text-sm">Total {documents.length} documents</span>
					</div>
					<div className="flex min-h-[647.5px] flex-col justify-between">
						<div className="relative">
							<Table.ScrollContainer>
								<Table.Content
									aria-label="Student documents table"
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
										{isLoading ? null : error ? (
											<Table.Row>
												<Table.Cell colSpan={columns.length}>
													<TableError onRetry={refetch} />
												</Table.Cell>
											</Table.Row>
										) : items.length === 0 ? (
											<Table.Row>
												<Table.Cell colSpan={columns.length}>
													<div className="flex flex-col items-center gap-3">
														<p className="text-default-500 text-lg">No documents yet</p>
														<p className="text-default-400 text-sm">Upload documents to get started</p>
													</div>
												</Table.Cell>
											</Table.Row>
										) : (
											items.map((document) => (
												<Table.Row key={document.id}>
													{columns.map((column) => (
														<Table.Cell key={column.key}>{renderCell(document, column.key)}</Table.Cell>
													))}
												</Table.Row>
											))
										)}
									</Table.Body>
								</Table.Content>
							</Table.ScrollContainer>
							{isLoading && (
								<div className="pointer-events-none absolute inset-x-0 top-12.5 bottom-0 flex items-center justify-center rounded-b-2xl bg-white">
									<Spinner />
								</div>
							)}
						</div>
						{pages > 1 && (
							<div className="flex w-full justify-center pt-4">
								<div className="flex items-center gap-2">
									<Button size="sm" variant="outline" isDisabled={page <= 1} onPress={() => setPage(page - 1)}>
										Prev
									</Button>
									<span className="text-sm">
										Page {page} of {pages}
									</span>
									<Button size="sm" variant="outline" isDisabled={page >= pages} onPress={() => setPage(page + 1)}>
										Next
									</Button>
								</div>
							</div>
						)}
					</div>
				</Card.Content>
			</Card>
			<AddDocumentModal studentId={studentId} />
			<DeleteDocumentModal studentId={studentId} />
		</>
	)
}

export default StudentDocumentsTab
