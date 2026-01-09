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
	const [page, setPage] = useState(1)
	const status = viewDeactivated ? "inactive" : "active"
	const { rooms, total, totalPages, isLoading, error, refetch } = useRooms({ status, page })

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-end gap-5">
					<Switch
						classNames={{ label: "text-neutral-600 text-sm" }}
						isSelected={viewDeactivated}
						onValueChange={(value) => {
							setViewDeactivated(value)
							setPage(1)
						}}
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
				<span className="text-default-400 text-small">Total {total} rooms</span>
			</div>
		)
	}, [viewDeactivated, setViewDeactivated, total])

	return (
		<Card>
			<CardBody className="flex flex-col gap-4 p-4">
				{topContent}
				<Table
					aria-label="Rooms table"
					removeWrapper
					bottomContent={
						totalPages > 1 ? (
							<div className="flex w-full justify-center">
								<Pagination
									isCompact
									showControls
									showShadow
									color="primary"
									page={page}
									total={totalPages}
									onChange={(newPage) => setPage(newPage)}
								/>
							</div>
						) : null
					}
					bottomContentPlacement="outside"
					classNames={{
						base: "min-h-[595.5px]",
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
						emptyContent={error ? <TableError onRetry={refetch} /> : <RoomsEmptyState />}
						items={error || isLoading ? [] : rooms}
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
