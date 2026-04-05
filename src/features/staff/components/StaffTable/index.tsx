import { Button, EmptyState, Label, Pagination, Spinner, Switch, Table } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import TableError from "@/components/TableError"
import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"

import { useEmployees } from "../../hooks/useStaff"
import { openAddStaffModal } from "../../stores/addStaffModal.store"
import AddStaffModal from "../AddStaffModal"

import columns from "./columns"
import { renderCell } from "./renderCell"

const StaffTable = () => {
	const navigate = useNavigate()
	const [page, setPage] = useState(1)
	const [showDeactivated, setShowDeactivated] = useState(false)
	const status = showDeactivated ? "inactive" : "active"
	const { data: employees = [], isLoading, error, refetch } = useEmployees(status)
	const pageSize = 10

	const handleEmployeeClick = (employeeId: string) => {
		navigate({ to: "/staff/$staffId", params: { staffId: employeeId }, search: { tab: "profile" } })
	}

	const total = employees.length
	const totalPages = Math.ceil(total / pageSize) || 1
	const startItem = (page - 1) * pageSize + 1
	const endItem = Math.min(page * pageSize, total)
	const items = employees.slice((page - 1) * pageSize, page * pageSize)

	const topContent = (
		<div className="flex items-center justify-end gap-5">
			<Switch
				isSelected={showDeactivated}
				onChange={(isSelected: boolean) => {
					setShowDeactivated(isSelected)
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
			<Button variant="primary" onPress={openAddStaffModal}>
				<OcticonFeedPlus16 aria-hidden className="size-4" />
				Add Staff
			</Button>
		</div>
	)

	const renderCellOptions = { onEmployeeClick: handleEmployeeClick }

	return (
		<>
			<AddStaffModal />
			<div className="flex flex-col gap-4">
				{topContent}
				<Table className="[&_td]:py-1.5! [&_tr]:h-12.5!">
					<div className="relative">
						<Table.ScrollContainer className="min-h-140">
							<Table.Content aria-label="Employees table">
								<Table.Header columns={columns}>
									{(column) => (
										<Table.Column
											isRowHeader={column.isRowHeader}
											className={column.align === "center" ? "text-center" : undefined}
										>
											{column.label}
										</Table.Column>
									)}
								</Table.Header>
								{isLoading ? (
									<Table.Body />
								) : error ? (
									<Table.Body>
										<Table.Row>
											<Table.Cell colSpan={columns.length}>
												<TableError onRetry={refetch} />
											</Table.Cell>
										</Table.Row>
									</Table.Body>
								) : items.length === 0 ? (
									<Table.Body>
										<Table.Row>
											<Table.Cell colSpan={columns.length}>
												<EmptyState className="flex h-131 w-full items-center justify-center text-default-400">
													{showDeactivated ? "No deactivated staff members" : "No staff members found"}
												</EmptyState>
											</Table.Cell>
										</Table.Row>
									</Table.Body>
								) : (
									<Table.Body items={items}>
										{(employee) => (
											<Table.Row id={employee.id}>
												<Table.Collection items={columns}>
													{(column) => <Table.Cell>{renderCell(employee, column.key, renderCellOptions)}</Table.Cell>}
												</Table.Collection>
											</Table.Row>
										)}
									</Table.Body>
								)}
							</Table.Content>
						</Table.ScrollContainer>
						{isLoading && (
							<div className="pointer-events-none absolute inset-x-0 top-12.5 bottom-0 flex items-center justify-center rounded-b-2xl bg-white">
								<Spinner />
							</div>
						)}
					</div>
					<Table.Footer>
						<Pagination className="w-full">
							<Pagination.Summary>
								{startItem} to {endItem} of {total} employees
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
		</>
	)
}

export default StaffTable
