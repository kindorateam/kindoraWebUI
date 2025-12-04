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
import { useMemo, useState } from "react"

import TableError from "@/components/TableError"
import TablerCirclePlusFilled from "~icons/tabler/circle-plus-filled"

import { usePinVisibility, useStaff } from "../../hooks/useStaff"

import columns from "./columns"
import { renderCell } from "./renderCell"

const StaffTable = () => {
	const { data: staff = [], isLoading, error, refetch } = useStaff()
	const { isPinVisible, togglePinVisibility } = usePinVisibility()
	const [page, setPage] = useState(1)
	const [showDeactivated, setShowDeactivated] = useState(false)
	const rowsPerPage = 10

	const filteredItems = useMemo(() => {
		// TODO: Filter by deactivated status when staff have status field
		return staff
	}, [staff])

	const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage

		return filteredItems.slice(start, end)
	}, [page, filteredItems])

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-end gap-3">
					<div className="flex items-center gap-2">
						<span className="text-neutral-600 text-sm">View deactivated</span>
						<Switch isSelected={showDeactivated} onValueChange={setShowDeactivated} size="sm" />
					</div>
					<Button color="primary" endContent={<TablerCirclePlusFilled className="size-5 text-white" />}>
						Add Staff
					</Button>
				</div>
				<span className="text-default-400 text-small">Total {filteredItems.length} staff members</span>
			</div>
		)
	}, [showDeactivated, filteredItems.length])

	const renderCellOptions = useMemo(() => ({ isPinVisible, togglePinVisibility }), [isPinVisible, togglePinVisibility])

	return (
		<Card>
			<CardBody className="p-4">
				<Table
					aria-label="Staff table"
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
						td: "py-3",
						tbody: "min-h-[400px]",
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
						emptyContent={error ? <TableError onRetry={refetch} /> : "No staff members found"}
						items={error || isLoading ? [] : items}
						isLoading={isLoading}
						loadingContent={<Spinner size="lg" />}
					>
						{(staffMember) => (
							<TableRow key={staffMember.id}>
								{(columnKey) => <TableCell>{renderCell(staffMember, columnKey, renderCellOptions)}</TableCell>}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	)
}

export default StaffTable
