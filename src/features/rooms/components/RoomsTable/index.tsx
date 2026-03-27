import { Button, EmptyState, Label, Pagination, Spinner, Switch, Table } from "@heroui/react"
import { useAtom } from "jotai"
import { useMemo, useState } from "react"

import TableError from "@/components/TableError"

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

	const pageSize = 10
	const startItem = (page - 1) * pageSize + 1
	const endItem = Math.min(page * pageSize, total)

	const topContent = useMemo(() => {
		return (
			<div className="flex items-center justify-end gap-5">
				<Switch
					isSelected={viewDeactivated}
					onChange={(isSelected: boolean) => {
						setViewDeactivated(isSelected)
						setPage(1)
					}}
				>
					<Switch.Control>
						<Switch.Thumb />
					</Switch.Control>
					<Switch.Content>
						<Label className="text-sm">View deactivated</Label>
					</Switch.Content>
				</Switch>
				<Button variant="primary" onPress={openAddRoomModal}>
					Add Room
				</Button>
			</div>
		)
	}, [viewDeactivated, setViewDeactivated])

	return (
		<div className="flex flex-col gap-4">
			{topContent}
			<div className="flex flex-col justify-between">
				<Table>
					<Table.ScrollContainer className="min-h-[560px]">
						<Table.Content aria-label="Rooms table">
							<Table.Header>
								{columns.map((column) => (
									<Table.Column
										key={column.key}
										isRowHeader={column.isRowHeader}
										className={column.align === "center" ? "text-center" : undefined}
									>
										{column.label}
									</Table.Column>
								))}
							</Table.Header>
							<Table.Body>
								{isLoading ? (
									<Table.Row>
										<Table.Cell colSpan={columns.length}>
											<EmptyState className="flex h-[524px] w-full items-center justify-center">
												<Spinner />
											</EmptyState>
										</Table.Cell>
									</Table.Row>
								) : error ? (
									<Table.Row>
										<Table.Cell colSpan={columns.length}>
											<TableError onRetry={refetch} />
										</Table.Cell>
									</Table.Row>
								) : rooms.length === 0 ? (
									<Table.Row>
										<Table.Cell colSpan={columns.length}>
											<RoomsEmptyState isDeactivatedView={viewDeactivated} />
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
					<Table.Footer>
						<Pagination className="w-full">
							<Pagination.Summary>
								{startItem} to {endItem} of {total} rooms
							</Pagination.Summary>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.Previous isDisabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
										<Pagination.PreviousIcon />
										<span>Prev</span>
									</Pagination.Previous>
								</Pagination.Item>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
									<Pagination.Item key={p}>
										<Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
											{p}
										</Pagination.Link>
									</Pagination.Item>
								))}
								<Pagination.Item>
									<Pagination.Next isDisabled={page >= totalPages} onPress={() => setPage((p) => p + 1)}>
										<span>Next</span>
										<Pagination.NextIcon />
									</Pagination.Next>
								</Pagination.Item>
							</Pagination.Content>
						</Pagination>
					</Table.Footer>
				</Table>
			</div>
		</div>
	)
}

export default RoomsTable
