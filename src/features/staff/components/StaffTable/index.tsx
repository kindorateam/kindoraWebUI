import { Button, Card, Spinner, Switch, Table } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { useCallback, useMemo, useState } from "react"

import TableError from "@/components/TableError"

import { useEmployees } from "../../hooks/useStaff"
import { openAddStaffModal } from "../../stores/addStaffModal.store"
import AddStaffModal from "../AddStaffModal"

import columns from "./columns"
import { renderCell } from "./renderCell"

const StaffTable = () => {
	const navigate = useNavigate()
	const { data: employees = [], isLoading, error, refetch } = useEmployees()
	const [page, setPage] = useState(1)
	const [showDeactivated, setShowDeactivated] = useState(false)
	const rowsPerPage = 10

	const handleEmployeeClick = useCallback(
		(employeeId: string) => {
			navigate({ to: "/staff/$staffId", params: { staffId: employeeId }, search: { tab: "profile" } })
		},
		[navigate],
	)

	const filteredItems = useMemo(() => {
		if (showDeactivated) {
			return employees
		}
		return employees.filter((employee) => employee.status === "active")
	}, [employees, showDeactivated])

	const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage

		return filteredItems.slice(start, end)
	}, [page, filteredItems])

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-end gap-5">
					<Switch
						className="text-sm"
						isSelected={showDeactivated}
						onChange={(isSelected: boolean) => setShowDeactivated(isSelected)}
						size="sm"
					>
						View deactivated
					</Switch>
					<Button variant="primary" onPress={openAddStaffModal}>
						Add Staff
					</Button>
				</div>
				<span className="text-default-400 text-sm">Total {filteredItems.length} employees</span>
			</div>
		)
	}, [showDeactivated, filteredItems.length])

	const renderCellOptions = useMemo(() => ({ onEmployeeClick: handleEmployeeClick }), [handleEmployeeClick])

	return (
		<>
			<AddStaffModal />
			<Card>
				<Card.Content className="flex flex-col gap-4 p-4">
					{topContent}
					<Table className="min-h-[595.5px]">
						<Table.ScrollContainer>
							<Table.Content aria-label="Employees table">
								<Table.Header className="[&>tr>th]:py-0">
									{columns.map((column) => (
										<Table.Column key={column.key} className={column.align === "center" ? "text-center" : ""}>
											{column.label}
										</Table.Column>
									))}
								</Table.Header>
								<Table.Body className="[&>tr:last-child]:border-b-0 [&>tr]:h-[55px] [&>tr]:border-default-200 [&>tr]:border-b">
									{isLoading ? (
										<Table.Row>
											<Table.Cell colSpan={columns.length}>
												<div className="flex justify-center py-8">
													<Spinner size="lg" />
												</div>
											</Table.Cell>
										</Table.Row>
									) : error ? (
										<Table.Row>
											<Table.Cell colSpan={columns.length}>
												<TableError onRetry={refetch} />
											</Table.Cell>
										</Table.Row>
									) : items.length === 0 ? (
										<Table.Row>
											<Table.Cell colSpan={columns.length}>
												<div className="flex h-[550px] flex-col items-center justify-center gap-3">
													<p className="text-default-500 text-lg">No staff members yet</p>
													<p className="text-default-400 text-sm">Add your first staff member to get started</p>
												</div>
											</Table.Cell>
										</Table.Row>
									) : (
										items.map((employee) => (
											<Table.Row key={employee.id}>
												{columns.map((column) => (
													<Table.Cell className="py-0" key={column.key}>
														{renderCell(employee, column.key, renderCellOptions)}
													</Table.Cell>
												))}
											</Table.Row>
										))
									)}
								</Table.Body>
							</Table.Content>
						</Table.ScrollContainer>
					</Table>
					{pages > 1 && (
						<div className="mt-auto flex w-full justify-center">
							<div className="flex items-center gap-2">
								<Button size="sm" variant="outline" isDisabled={page <= 1} onPress={() => setPage(page - 1)}>
									Prev
								</Button>
								<span className="text-sm">
									Page {page} of {pages}
								</span>
								<Button size="sm" variant="outline" isDisabled={page >= pages} onPress={() => setPage(page + 1)}>
									Next
								</Button>
							</div>
						</div>
					)}
				</Card.Content>
			</Card>
		</>
	)
}

export default StaffTable
