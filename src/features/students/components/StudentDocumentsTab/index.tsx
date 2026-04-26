import { Button, EmptyState, Pagination, Spinner, Table } from "@heroui/react"
import { useState } from "react"

import TableError from "@/components/TableError"
import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"

import { useStudentDocuments } from "../../hooks/useStudents"
import { openAddDocumentModal } from "../../stores/addDocumentModal.store"
import AddDocumentModal from "../AddDocumentModal"
import DeleteDocumentModal from "../DeleteDocumentModal"

import columns from "./columns"
import { renderCell } from "./renderCell"

interface StudentDocumentsTabProps {
	studentId: string
}

const pageSize = 10

const StudentDocumentsTab = ({ studentId }: StudentDocumentsTabProps) => {
	const { data: documents = [], isLoading, error, refetch } = useStudentDocuments(studentId)
	const [page, setPage] = useState(1)

	const total = documents.length
	const totalPages = Math.ceil(total / pageSize) || 1
	const startItem = (page - 1) * pageSize + 1
	const endItem = Math.min(page * pageSize, total)
	const items = documents.slice((page - 1) * pageSize, page * pageSize)
	const hasError = Boolean(error)
	const showLoading = isLoading
	const isEmpty = !showLoading && !hasError && items.length === 0

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-end">
					<Button variant="primary" onPress={openAddDocumentModal}>
						<OcticonFeedPlus16 aria-hidden className="size-4" />
						Add Document
					</Button>
				</div>
				<Table className="[&_td]:py-1.5! [&_tr]:h-12.5!">
					<div className="relative">
						<Table.ScrollContainer className="min-h-140">
							<Table.Content aria-label="Student documents table">
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
									<Table.Body items={items}>
										{(document) => (
											<Table.Row id={document.id}>
												<Table.Collection items={columns}>
													{(column) => <Table.Cell>{renderCell(document, column.key)}</Table.Cell>}
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
								<EmptyState className="flex h-full w-full items-center justify-center text-default-400">
									No documents yet
								</EmptyState>
							</div>
						)}
					</div>
					<Table.Footer>
						<Pagination className="w-full">
							<Pagination.Summary>
								{startItem} to {endItem} of {total} documents
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
			<AddDocumentModal studentId={studentId} />
			<DeleteDocumentModal studentId={studentId} />
		</>
	)
}

export default StudentDocumentsTab
