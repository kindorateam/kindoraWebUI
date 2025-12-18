import {
	Button,
	Card,
	CardBody,
	Pagination,
	Spinner,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react"
import { useAtom } from "jotai"
import { useMemo, useState } from "react"

import TableError from "@/components/TableError"
import TablerCirclePlusFilled from "~icons/tabler/circle-plus-filled"

import { useRooms } from "../../hooks/useRooms"
import { openAddRoomModal } from "../../stores/addRoomModal.store"
import { viewDeactivatedRoomsAtom } from "../../stores/viewDeactivatedRooms.store"
import RoomsEmptyState from "../RoomsEmptyState"

import columns from "./columns"
import RoomsTableCell from "./RoomsTableCell"

const RoomsTable = () => {
	const [viewDeactivated, setViewDeactivated] = useAtom(viewDeactivatedRoomsAtom)
	const status = viewDeactivated ? "inactive" : "active"
	const { data: rooms = [], isLoading, error, refetch } = useRooms(status)
	const [page, setPage] = useState(1)
	const rowsPerPage = 10

	const pages = Math.ceil(rooms.length / rowsPerPage) || 1

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage

		return rooms.slice(start, end)
	}, [page, rooms])

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-end gap-5">
					<Switch
						classNames={{ label: "text-neutral-600 text-sm" }}
						isSelected={viewDeactivated}
						onValueChange={setViewDeactivated}
						size="sm"
					>
						View deactivated
					</Switch>
					<Button
						color="primary"
						endContent={<TablerCirclePlusFilled className="size-5 text-white" />}
						onPress={openAddRoomModal}
					>
						Add Room
					</Button>
				</div>
				<span className="text-default-400 text-small">Total {rooms.length} rooms</span>
			</div>
		)
	}, [viewDeactivated, setViewDeactivated, rooms.length])

	return (
		<Card>
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
							<TableRow key={room.id}>
								{(columnKey) => (
									<TableCell>
										<RoomsTableCell columnKey={columnKey} room={room} />
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	)
}

export default RoomsTable
