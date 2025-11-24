import { Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { useMemo, useState } from "react"

import TableError from "@/components/TableError"

import { useRooms } from "../../hooks/useRooms"
import RoomsEmptyState from "../RoomsEmptyState"

import columns from "./columns"
import { renderCell } from "./renderCell"

const RoomsTable = () => {
	const { data: rooms = [], isLoading, error, refetch } = useRooms()
	const [page, setPage] = useState(1)
	const rowsPerPage = 10

	const pages = Math.ceil(rooms.length / rowsPerPage)

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage

		return rooms.slice(start, end)
	}, [page, rooms])

	if (isLoading) {
		return (
			<div className="flex h-[678px] items-center justify-center">
				<Spinner size="lg" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="h-[678px]">
				<TableError onRetry={refetch} />
			</div>
		)
	}

	return (
		<Table
			aria-label="Rooms table"
			bottomContent={
				pages > 0 ? (
					<div className="flex w-full justify-center">
						<Pagination
							isCompact
							showControls
							showShadow
							color="primary"
							page={page}
							total={pages}
							onChange={(page) => setPage(page)}
						/>
					</div>
				) : null
			}
			classNames={{
				thead: "[&>tr]:h-auto",
				tr: "h-[60px] border-b border-default-200 last:border-b-0",
				td: "p-0",
			}}
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn key={column.key} align={column.align}>
						{column.label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody emptyContent={<RoomsEmptyState />} items={items} isLoading={true}>
				{(room) => (
					<TableRow key={room.id}>{(columnKey) => <TableCell>{renderCell(room, columnKey)}</TableCell>}</TableRow>
				)}
			</TableBody>
		</Table>
	)
}

export default RoomsTable
