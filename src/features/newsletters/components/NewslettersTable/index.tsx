import { Button, EmptyState, Spinner, Table } from "@heroui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import TablePagination from "@/components/ui/TablePagination"

import columns from "./columns"
import { renderCell } from "./renderCell"

import type { Newsletter } from "../../types"

interface NewslettersTableProps {
	onCreateNew: () => void
}

// Mock data - will be replaced with API call
const newslettersData: Newsletter[] = [
	{ id: "n1", title: "Little Explorers Weekly", sentDate: "08.05.2025", status: "sent" },
	{ id: "n2", title: "Tiny Steps, Big Adventures", sentDate: "09.05.2025", status: "sent" },
	{ id: "n3", title: "Peek Inside Our Preschool", sentDate: "10.05.2025", status: "sent" },
	{ id: "n4", title: "Sunshine & Smiles Update", sentDate: "11.05.2025", status: "sent" },
	{ id: "n5", title: "From Our Classroom to Your Home", sentDate: "12.05.2025", status: "sent" },
]

const NewslettersTable = ({ onCreateNew }: NewslettersTableProps) => {
	const { i18n, t } = useTranslation()
	const [page, setPage] = useState(1)
	const newsletters = newslettersData
	const isLoading = false
	const pageSize = 10
	const total = newsletters.length
	const totalPages = Math.ceil(total / pageSize) || 1
	const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1
	const endItem = Math.min(page * pageSize, total)
	const items = newsletters.slice((page - 1) * pageSize, page * pageSize)
	const isEmpty = !isLoading && items.length === 0

	const topContent = (
		<div className="flex items-center justify-end">
			<Button variant="primary" onPress={onCreateNew}>
				{t("newsletters.table.createNew")}
			</Button>
		</div>
	)

	return (
		<div className="flex flex-col gap-4">
			{topContent}
			<Table aria-label={t("newsletters.table.ariaLabel")} className="[&_td]:py-1.5! [&_tr]:h-12.5!">
				<div className="relative">
					<Table.ScrollContainer className="min-h-140">
						<Table.Content key={i18n.language} className="min-w-125">
							<Table.Header columns={columns}>
								{(column) => <Table.Column isRowHeader={column.isRowHeader}>{t(column.labelKey)}</Table.Column>}
							</Table.Header>
							{isLoading || isEmpty ? (
								<Table.Body />
							) : (
								<Table.Body items={items}>
									{(newsletter) => (
										<Table.Row id={newsletter.id}>
											<Table.Collection items={columns}>
												{(column) => <Table.Cell>{renderCell(newsletter, column.key)}</Table.Cell>}
											</Table.Collection>
										</Table.Row>
									)}
								</Table.Body>
							)}
						</Table.Content>
					</Table.ScrollContainer>
					{isLoading && (
						<div className="pointer-events-none absolute inset-x-0 top-12.5 bottom-0 flex items-center justify-center rounded-[calc(var(--radius)*2)] bg-white">
							<Spinner size="lg" />
						</div>
					)}
					{isEmpty && (
						<div className="absolute inset-x-0 top-12.5 bottom-0 rounded-[calc(var(--radius)*2)] bg-white">
							<EmptyState className="flex h-full w-full items-center justify-center text-default-400">
								{t("newsletters.table.emptySent")}
							</EmptyState>
						</div>
					)}
				</div>
				<Table.Footer>
					<TablePagination
						onPageChange={setPage}
						page={page}
						summary={t("newsletters.table.paginationSummary", { count: total, endItem, startItem, total })}
						totalPages={totalPages}
					/>
				</Table.Footer>
			</Table>
		</div>
	)
}

export default NewslettersTable
