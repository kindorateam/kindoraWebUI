import { Button, EmptyState, Pagination, Spinner, Table } from "@heroui/react"
import { useState } from "react"

import TableError from "@/components/TableError"
import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"

import { useEmployeeDocuments } from "../../hooks/useStaff"
import { openAddDocumentModal } from "../../stores/addDocumentModal.store"
import AddDocumentModal from "../AddDocumentModal"
import DeleteDocumentModal from "../DeleteDocumentModal"

import columns from "./columns"
import { renderCell } from "./renderCell"

interface StaffDocumentsTabProps {
	employeeId: string
}

const pageSize = 10

const StaffDocumentsTab = ({ employeeId }: StaffDocumentsTabProps) => {
	const { data: documents = [], isLoading, error, refetch } = useEmployeeDocuments(employeeId)
	const [page, setPage] = useState(1)

	const total = documents.length
	const totalPages = Math.ceil(total / pageSize) || 1
	const startItem = (page - 1) * pageSize + 1
	const endItem = Math.min(page * pageSize, total)
	const items = documents.slice((page - 1) * pageSize, page * pageSize)

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
							<Table.Content aria-label="Employee documents table">
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
									{isLoading ? null : error ? (
										<Table.Row>
											<Table.Cell colSpan={columns.length}>
												<TableError onRetry={refetch} />
											</Table.Cell>
										</Table.Row>
									) : items.length === 0 ? (
										<Table.Row>
											<Table.Cell colSpan={columns.length}>
												<EmptyState className="flex h-131 w-full items-center justify-center text-default-400">
													No documents yet
												</EmptyState>
											</Table.Cell>
										</Table.Row>
									) : (
										items.map((doc) => (
											<Table.Row key={doc.id}>
												{columns.map((column) => (
													<Table.Cell key={column.key}>{renderCell(doc, column.key)}</Table.Cell>
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
			<AddDocumentModal employeeId={employeeId} />
			<DeleteDocumentModal employeeId={employeeId} />
		</>
	)
}

export default StaffDocumentsTab
