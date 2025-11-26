import {
	Button,
	Card,
	CardBody,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Pagination,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react"
import { Icon } from "@iconify/react"
import { useMemo, useState } from "react"

import TableError from "@/components/TableError"

import { useRooms } from "../../hooks/useRooms"
import { openAddRoomModal } from "../../stores/addRoomModal.store"
import RoomsEmptyState from "../RoomsEmptyState"

import columns from "./columns"
import { renderCell } from "./renderCell"

import type { Selection } from "@heroui/react"

//@ts-expect-error
import ChevronDown from "/~iconify/tabler/chevron-down"

const statusOptions = [
	{ name: "Active", uid: "active" },
	{ name: "Inactive", uid: "inactive" },
]

const RoomsTable = () => {
	const { data: rooms = [], isLoading, error, refetch } = useRooms()
	const [page, setPage] = useState(1)
	const [statusFilter, setStatusFilter] = useState<Selection>("all")
	const rowsPerPage = 10

	const filteredItems = useMemo(() => {
		// Status filter - uncomment when rooms have status field
		// if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
		// 	return rooms.filter((room) =>
		// 		Array.from(statusFilter).includes(room.status),
		// 	)
		// }

		return rooms
	}, [rooms])

	const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage

		return filteredItems.slice(start, end)
	}, [page, filteredItems])

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-end justify-end gap-3">
					<Dropdown>
						<DropdownTrigger className="hidden sm:flex">
							<Button endContent={<ChevronDown height="14" />} variant="flat">
								Status
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							aria-label="Status filter"
							closeOnSelect={false}
							disallowEmptySelection
							selectedKeys={statusFilter}
							selectionMode="multiple"
							onSelectionChange={setStatusFilter}
						>
							{statusOptions.map((status) => (
								<DropdownItem key={status.uid} className="capitalize">
									{status.name}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
					<Button
						color="primary"
						endContent={<Icon className="size-5 text-white" icon="tabler:circle-plus-filled" />}
						onPress={openAddRoomModal}
					>
						Add Room
					</Button>
				</div>
				<span className="text-default-400 text-small">Total {filteredItems.length} rooms</span>
			</div>
		)
	}, [statusFilter, filteredItems.length])

	return (
		<Card shadow="md">
			<CardBody className="p-4">
				<Table
					aria-label="Rooms table"
					removeWrapper
					topContent={topContent}
					topContentPlacement="outside"
					bottomContent={
						pages > 1 ? (
							<div className="flex w-full justify-center">
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
						) : null
					}
					bottomContentPlacement="outside"
					classNames={{
						tr: "border-b border-default-200 last:border-b-0",
						td: "p-0",
						tbody: "h-[550px] [&>tr]:h-[55px]",
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
						emptyContent={error ? <TableError onRetry={refetch} /> : <RoomsEmptyState />}
						items={error || isLoading ? [] : items}
						isLoading={isLoading}
						loadingContent={<Spinner size="lg" />}
					>
						{(room) => (
							<TableRow key={room.id}>{(columnKey) => <TableCell>{renderCell(room, columnKey)}</TableCell>}</TableRow>
						)}
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	)
}

export default RoomsTable
