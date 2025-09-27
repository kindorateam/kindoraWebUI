import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"

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
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
			</div>
		)
	}

	if (!data || data.length === 0) {
		return <div className="flex h-64 items-center justify-center text-gray-500">{emptyMessage}</div>
	}

	return (
		<div className={`w-full ${className}`}>
			<Table
				aria-label="Data table"
				classNames={{
					wrapper: "min-w-full p-0 shadow-none! bg-transparent",
					base: "p-0",
					thead: '[&>tr]:first:rounded-none [&>[aria-hidden="true"]]:hidden',
					tr: "border-b last:border-b-0 border-black/4! data-[first=true]:pt-2!",
					th: "p-0 pb-4 bg-transparent text-xs!",
					td: "p-0 py-2.5",
				}}
			>
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							align={column.align ?? "start"}
							className={`text-text-secondary text-left text-sm font-medium tracking-wider ${column.className ?? ""}`}
							key={column.key}
						>
							{column.label}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody items={data}>
					{(item) => (
						<TableRow key={getRowKey(item)} onClick={() => onRowClick?.(item)}>
							{(columnKey) => {
								const column = columns.find((col) => col.key === columnKey)
								return (
									<TableCell className="whitespace-nowrap">
										{column?.renderCell
											? column.renderCell(item, column)
											: String((item as Record<string, unknown>)[columnKey])}
									</TableCell>
								)
							}}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}

export default DataTable
