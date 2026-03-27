import type { ReactNode } from "react"

export interface TableColumn<T> {
	key: string
	label: string
	align?: "start" | "center" | "end"
	isRowHeader?: boolean
	sortable?: boolean
	className?: string
	renderCell?: (item: T, column: TableColumn<T>) => ReactNode
}

export interface DataTableProps<T> {
	columns: TableColumn<T>[]
	data: T[]
	isLoading?: boolean
	emptyMessage?: string
	onRowClick?: (item: T) => void
	getRowKey: (item: T) => string | number
	className?: string
	tableClassName?: string
}

export interface TableConfig<T> {
	columns: TableColumn<T>[]
	getRowKey: (item: T) => string | number
	queryKey: string[]
	queryFn: () => Promise<T[]>
}
