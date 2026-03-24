import { Button, Card, Pagination, Spinner, Switch, Table } from "@heroui/react"
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
						className="text-sm"
						isSelected={viewDeactivated}
						onChange={(isSelected: boolean) => {
							setViewDeactivated(isSelected)
							setPage(1)
						}}
						size="sm"
					>
						View deactivated
					</Switch>
					<Button variant="primary" onPress={openAddRoomModal}>
						Add Room
					</Button>
				</div>
				<span className="text-default-400 text-sm">Total {total} rooms</span>
			</div>
		)
	}, [viewDeactivated, setViewDeactivated, total])

	return (
		<Card>
			<Card.Content className="flex flex-col gap-4 p-4">
				{topContent}
				<div className="flex min-h-[647.5px] flex-col justify-between">
					<Table.ScrollContainer>
						<Table.Content
							aria-label="Rooms table"
							className="[&_tbody>tr]:h-[55px] [&_tbody>tr]:border-b [&_tbody>tr]:border-default-200 [&_tbody>tr:last-child]:border-b-0 [&_th]:py-0 [&_td]:py-0"
						>
							<Table.Header>
								{columns.map((column) => (
									<Table.Column key={column.key} className={column.align === "center" ? "text-center" : undefined}>
										{column.label}
									</Table.Column>
								))}
							</Table.Header>
							<Table.Body
								items={error || isLoading ? [] : rooms}
								renderEmptyState={() =>
									error ? <TableError onRetry={refetch} /> : <RoomsEmptyState isDeactivatedView={viewDeactivated} />
								}
							>
								{isLoading ? (
									<Table.Row>
										<Table.Cell colSpan={columns.length} className="h-[550px] text-center">
											<Spinner size="lg" />
										</Table.Cell>
									</Table.Row>
								) : (
									rooms.map((room) => (
										<Table.Row key={room.id}>
											{columns.map((column) => (
												<Table.Cell key={column.key}>
													<RoomsTableCell columnKey={column.key} room={room} />
												</Table.Cell>
											))}
										</Table.Row>
									))
								)}
							</Table.Body>
						</Table.Content>
					</Table.ScrollContainer>
					{totalPages > 1 && (
						<div className="flex w-full justify-center pt-4">
							<div className="flex items-center gap-2">
								<Button size="sm" variant="outline" isDisabled={page <= 1} onPress={() => setPage(page - 1)}>
									Prev
								</Button>
								<span className="text-sm">
									Page {page} of {totalPages}
								</span>
								<Button size="sm" variant="outline" isDisabled={page >= totalPages} onPress={() => setPage(page + 1)}>
									Next
								</Button>
							</div>
						</div>
					)}
				</div>
			</Card.Content>
		</Card>
	)
}

export default RoomsTable
