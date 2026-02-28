import {
	Button,
	Card,
	CardBody,
	Pagination,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react"
import { useMemo, useState } from "react"

import TableError from "@/components/TableError"
import TablerCirclePlusFilled from "~icons/tabler/circle-plus-filled"

import { useEmployeeDocuments } from "../../hooks/useStaff"
import { openAddDocumentModal } from "../../stores/addDocumentModal.store"
import AddDocumentModal from "../AddDocumentModal"
import DeleteDocumentModal from "../DeleteDocumentModal"

import columns from "./columns"
import { renderCell } from "./renderCell"

interface StaffDocumentsTabProps {
	employeeId: string
}

const rowsPerPage = 10

const StaffDocumentsTab = ({ employeeId }: StaffDocumentsTabProps) => {
	const { data: documents = [], isLoading, error, refetch } = useEmployeeDocuments(employeeId)
	const [page, setPage] = useState(1)

	const pages = Math.ceil(documents.length / rowsPerPage) || 1

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage
		return documents.slice(start, end)
	}, [page, documents])

	return (
		<>
			<Card>
				<CardBody className="flex flex-col gap-4 p-4">
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-end">
							<Button
								color="primary"
								endContent={<TablerCirclePlusFilled className="size-5 text-white" />}
								onPress={openAddDocumentModal}
							>
								Add Document
							</Button>
						</div>
						<span className="text-default-400 text-small">Total {documents.length} documents</span>
					</div>
					<div className="flex min-h-[647.5px] flex-col justify-between">
						<Table
							aria-label="Employee documents table"
							removeWrapper
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
								emptyContent={
									error ? (
										<TableError onRetry={refetch} />
									) : (
										<div className="flex flex-col items-center gap-3">
											<p className="text-default-500 text-lg">No documents yet</p>
											<p className="text-default-400 text-sm">Upload documents to get started</p>
										</div>
									)
								}
								items={error || isLoading ? [] : items}
								isLoading={isLoading}
								loadingContent={<Spinner size="lg" />}
							>
								{(doc) => (
									<TableRow key={doc.id}>{(columnKey) => <TableCell>{renderCell(doc, columnKey)}</TableCell>}</TableRow>
								)}
							</TableBody>
						</Table>
						{pages > 1 && (
							<div className="flex w-full justify-center pt-4">
								<Pagination
									isCompact
									showControls
									showShadow
									color="primary"
									page={page}
									total={pages}
									onChange={(newPage) => setPage(newPage)}
								/>
							</div>
						)}
					</div>
				</CardBody>
			</Card>
			<AddDocumentModal employeeId={employeeId} />
			<DeleteDocumentModal employeeId={employeeId} />
		</>
	)
}

export default StaffDocumentsTab
