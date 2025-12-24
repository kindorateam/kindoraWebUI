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
import { useNavigate } from "@tanstack/react-router"
import { useCallback, useMemo, useState } from "react"

import TableError from "@/components/TableError"
import TablerCirclePlusFilled from "~icons/tabler/circle-plus-filled"

import { useEmployees } from "../../hooks/useStaff"

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
						classNames={{ label: "text-neutral-600 text-sm" }}
						isSelected={showDeactivated}
						onValueChange={setShowDeactivated}
						size="sm"
					>
						View deactivated
					</Switch>
					<Button color="primary" endContent={<TablerCirclePlusFilled className="size-5 text-white" />}>
						Add Staff
					</Button>
				</div>
				<span className="text-default-400 text-small">Total {filteredItems.length} employees</span>
			</div>
		)
	}, [showDeactivated, filteredItems.length])

	const renderCellOptions = useMemo(() => ({ onEmployeeClick: handleEmployeeClick }), [handleEmployeeClick])

	return (
		<Card>
			<CardBody className="flex flex-col gap-4 p-4">
				{topContent}
				<Table
					aria-label="Employees table"
					removeWrapper
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
						emptyContent={error ? <TableError onRetry={refetch} /> : "No employees found"}
						items={error || isLoading ? [] : items}
						isLoading={isLoading}
						loadingContent={<Spinner size="lg" />}
					>
						{(employee) => (
							<TableRow key={employee.id}>
								{(columnKey) => <TableCell>{renderCell(employee, columnKey, renderCellOptions)}</TableCell>}
							</TableRow>
						)}
					</TableBody>
				</Table>
				{pages > 1 && (
					<div className="mt-auto flex w-full justify-center">
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
				)}
			</CardBody>
		</Card>
	)
}

export default StaffTable
