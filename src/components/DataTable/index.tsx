import { Table } from "@heroui/react"

import type { DataTableProps } from "@/types/table"

const DataTable = <T,>({
	columns,
	data,
	isLoading = false,
	emptyMessage = "No data available",
	onRowClick,
	getRowKey,
	className = "",
}: DataTableProps<T>) => {
	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2"></div>
			</div>
		)
	}

	if (!data || data.length === 0) {
		return <div className="flex h-64 items-center justify-center text-gray-500">{emptyMessage}</div>
	}

	return (
		<div className={`w-full ${className}`}>
			<Table className="p-0">
				<Table.ScrollContainer>
					<Table.Content aria-label="Data table" className="min-w-full bg-transparent p-0 shadow-none!">
						<Table.Header className='[&>tr]:first:rounded-none [&>[aria-hidden="true"]]:hidden' columns={columns}>
							{(column) => (
								<Table.Column
									align={column.align ?? "start"}
									className={`bg-transparent p-0 pb-4 text-left text-xs! font-medium text-text-secondary tracking-wider ${column.className ?? ""}`}
									key={column.key}
								>
									{column.label}
								</Table.Column>
							)}
						</Table.Header>
						<Table.Body items={data}>
							{(item) => (
								<Table.Row
									className="border-b border-black/4! last:border-b-0 data-[first=true]:pt-2!"
									key={getRowKey(item)}
									onClick={() => onRowClick?.(item)}
								>
									{(columnKey) => {
										const column = columns.find((col) => col.key === columnKey)
										return (
											<Table.Cell className="whitespace-nowrap p-0 py-2.5">
												{column?.renderCell
													? column.renderCell(item, column)
													: String((item as Record<string, unknown>)[columnKey])}
											</Table.Cell>
										)
									}}
								</Table.Row>
							)}
						</Table.Body>
					</Table.Content>
				</Table.ScrollContainer>
			</Table>
		</div>
	)
}

export default DataTable
