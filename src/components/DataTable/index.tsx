import { Table } from "@heroui/react"

import type { DataTableProps } from "@/types/table"

const alignClassMap = {
	start: "text-left",
	center: "text-center",
	end: "text-right",
} as const

const DataTable = <T extends Record<string, unknown>>({
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
						<Table.Header className='[&>[aria-hidden="true"]]:hidden [&>tr]:first:rounded-none'>
							{columns.map((column) => (
								<Table.Column
									className={`bg-transparent p-0 pb-4 font-medium text-text-secondary text-xs! tracking-wider ${alignClassMap[column.align ?? "start"]} ${column.className ?? ""}`}
									key={column.key}
								>
									{column.label}
								</Table.Column>
							))}
						</Table.Header>
						<Table.Body>
							{data.map((item) => (
								<Table.Row
									className="border-black/4! border-b last:border-b-0 data-[first=true]:pt-2!"
									key={getRowKey(item)}
									onClick={() => onRowClick?.(item)}
								>
									{columns.map((column) => (
										<Table.Cell className="whitespace-nowrap p-0 py-2.5" key={column.key}>
											{column.renderCell ? column.renderCell(item, column) : String(item[column.key] ?? "")}
										</Table.Cell>
									))}
								</Table.Row>
							))}
						</Table.Body>
					</Table.Content>
				</Table.ScrollContainer>
			</Table>
		</div>
	)
}

export default DataTable
