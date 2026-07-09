import { Button, Table } from "@heroui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import TableFeedbackOverlay from "@/components/ui/TableFeedbackOverlay"
import TablePagination from "@/components/ui/TablePagination"
import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"

import DocumentTableCell from "./DocumentTableCell"

import type { DocumentTranslationScope } from "./DocumentTableCell"
import type { DocumentRecord } from "./types"

interface DocumentTableProps {
	documents: DocumentRecord[]
	error: unknown
	isLoading: boolean
	onAdd: () => void
	onDelete: (documentId: number) => void
	onRetry: () => void
	translationScope: DocumentTranslationScope
}

const PAGE_SIZE = 10

const columns = [
	{ key: "name", label: "name", isRowHeader: true, align: undefined },
	{ key: "status", label: "status", isRowHeader: false, align: "center" as const },
	{ key: "expiryDate", label: "expiryDate", isRowHeader: false, align: undefined },
	{ key: "type", label: "type", isRowHeader: false, align: undefined },
	{ key: "uploaded", label: "uploaded", isRowHeader: false, align: undefined },
	{ key: "actions", label: "actions", isRowHeader: false, align: "center" as const },
] as const

type ColumnLabel = (typeof columns)[number]["label"]

const DocumentTable = ({
	documents,
	error,
	isLoading,
	onAdd,
	onDelete,
	onRetry,
	translationScope,
}: DocumentTableProps) => {
	const { i18n, t } = useTranslation()
	const [page, setPage] = useState(1)
	const total = documents.length
	const totalPages = Math.ceil(total / PAGE_SIZE) || 1
	const safePage = Math.min(page, totalPages)
	const startItem = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
	const endItem = Math.min(safePage * PAGE_SIZE, total)
	const items = documents.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
	const hasError = Boolean(error)
	const isEmpty = !isLoading && !hasError && items.length === 0
	const key = <Suffix extends string>(suffix: Suffix) => `${translationScope}.${suffix}` as const
	const columnKey = (label: ColumnLabel) => key(`columns.${label}`)

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-end">
				<Button onPress={onAdd} variant="primary">
					<OcticonFeedPlus16 aria-hidden className="size-4" />
					{t(key("addDocument"))}
				</Button>
			</div>
			<Table className="[&_td]:py-1.5! [&_tr]:h-12.5!">
				<div className="relative">
					<Table.ScrollContainer className="min-h-140">
						<Table.Content aria-label={t(key("ariaLabel"))} key={i18n.language}>
							<Table.Header columns={columns}>
								{(column) => (
									<Table.Column
										className={column.align === "center" ? "text-center" : undefined}
										isRowHeader={column.isRowHeader}
									>
										{t(columnKey(column.label))}
									</Table.Column>
								)}
							</Table.Header>
							{isLoading || hasError || isEmpty ? (
								<Table.Body />
							) : (
								<Table.Body items={items}>
									{(document) => (
										<Table.Row id={document.id}>
											<Table.Collection items={columns}>
												{(column) => (
													<Table.Cell>
														<DocumentTableCell
															columnKey={column.key}
															document={document}
															locale={i18n.language}
															onDelete={onDelete}
															translationScope={translationScope}
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
					<TableFeedbackOverlay
						emptyMessage={t(key("empty"))}
						hasError={hasError}
						isEmpty={isEmpty}
						isLoading={isLoading}
						onRetry={onRetry}
					/>
				</div>
				<Table.Footer>
					<TablePagination
						onPageChange={setPage}
						page={safePage}
						summary={t(key("paginationSummary"), { count: total, endItem, startItem, total })}
						totalPages={totalPages}
					/>
				</Table.Footer>
			</Table>
		</div>
	)
}

export default DocumentTable
