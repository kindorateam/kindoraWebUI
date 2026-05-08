import { Button, Label, Pagination, Spinner, Switch, Table } from "@heroui/react"
import { useAtom } from "jotai"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import TableError from "@/components/TableError"
import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"

import { useRooms } from "../../hooks/useRooms"
import { openAddRoomModal } from "../../stores/addRoomModal.store"
import { viewDeactivatedRoomsAtom } from "../../stores/viewDeactivatedRooms.store"
import RoomsEmptyState from "../RoomsEmptyState"

import columns from "./columns"
import RoomsTableCell from "./RoomsTableCell"

const RoomsTable = () => {
	const { i18n, t } = useTranslation()
	const [viewDeactivated, setViewDeactivated] = useAtom(viewDeactivatedRoomsAtom)
	const [page, setPage] = useState(1)
	const status = viewDeactivated ? "inactive" : "active"
	const { rooms, total, totalPages, isLoading, error, refetch } = useRooms({ status, page })
	const hasError = Boolean(error)
	const visibleRooms = rooms
	const visibleTotal = total
	const visibleTotalPages = totalPages
	const showLoading = isLoading
	const isEmpty = !showLoading && !hasError && visibleRooms.length === 0

	const pageSize = 10
	const startItem = visibleTotal === 0 ? 0 : (page - 1) * pageSize + 1
	const endItem = Math.min(page * pageSize, visibleTotal)

	const topContent = (
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
					<Label className="text-sm">{t("rooms.table.viewDeactivated")}</Label>
				</Switch.Content>
			</Switch>
			<Button variant="primary" onPress={openAddRoomModal}>
				<OcticonFeedPlus16 aria-hidden className="size-4" />
				{t("rooms.addRoom.title")}
			</Button>
		</div>
	)

	return (
		<div className="flex flex-col gap-4">
			{topContent}
			<div className="flex flex-col justify-between">
				<Table className="[&_td]:py-1.5! [&_tr]:h-12.5!">
					<div className="relative">
						<Table.ScrollContainer className="min-h-140">
							<Table.Content key={i18n.language} aria-label={t("rooms.table.ariaLabel")}>
								<Table.Header columns={columns}>
									{(column) => (
										<Table.Column
											isRowHeader={column.isRowHeader}
											className={column.align === "center" ? "text-center" : undefined}
										>
											{t(column.labelKey)}
										</Table.Column>
									)}
								</Table.Header>
								{showLoading || isEmpty || hasError ? (
									<Table.Body />
								) : (
									<Table.Body items={visibleRooms}>
										{(room) => (
											<Table.Row id={room.id}>
												<Table.Collection items={columns}>
													{(column) => (
														<Table.Cell>
															<RoomsTableCell columnKey={column.key} room={room} />
														</Table.Cell>
													)}
												</Table.Collection>
											</Table.Row>
										)}
									</Table.Body>
								)}
							</Table.Content>
						</Table.ScrollContainer>
						{showLoading && (
							<div className="pointer-events-none absolute inset-x-0 top-12.5 bottom-0 flex items-center justify-center rounded-[calc(var(--radius)*2)] bg-white">
								<Spinner />
							</div>
						)}
						{isEmpty && (
							<div className="absolute inset-x-0 top-12.5 bottom-0 rounded-[calc(var(--radius)*2)] bg-white">
								<RoomsEmptyState isDeactivatedView={viewDeactivated} />
							</div>
						)}
						{hasError && (
							<div className="absolute inset-x-0 top-12.5 bottom-0 rounded-[calc(var(--radius)*2)] bg-white">
								<div className="flex h-full items-center justify-center px-4 py-8">
									<TableError onRetry={refetch} />
								</div>
							</div>
						)}
					</div>
					<Table.Footer>
						<Pagination className="w-full">
							<Pagination.Summary>
								{t("rooms.table.paginationSummary", { count: visibleTotal, endItem, startItem, total: visibleTotal })}
							</Pagination.Summary>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.Previous isDisabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
										<Pagination.PreviousIcon />
										<span>{t("common.previous")}</span>
									</Pagination.Previous>
								</Pagination.Item>
								{Array.from({ length: visibleTotalPages }, (_, i) => i + 1).map((p) => (
									<Pagination.Item key={p}>
										<Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
											{p}
										</Pagination.Link>
									</Pagination.Item>
								))}
								<Pagination.Item>
									<Pagination.Next isDisabled={page >= visibleTotalPages} onPress={() => setPage((p) => p + 1)}>
										<span>{t("common.next")}</span>
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
