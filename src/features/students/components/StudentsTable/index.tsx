import {
	Button,
	Card,
	CardBody,
	Pagination,
	Spinner,
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

import { useStudents } from "../../hooks/useStudents"
import StudentsEmptyState from "../StudentsEmptyState"

import columns from "./columns"
import StudentsTableCell from "./StudentsTableCell"

const StudentsTable = () => {
	const [page, setPage] = useState(1)
	const { students, total, totalPages, isLoading, error, refetch } = useStudents({ page })

	const topContent = useMemo(
		() => (
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-end">
					<Button color="primary" endContent={<TablerCirclePlusFilled className="size-5 text-white" />}>
						Add Student
					</Button>
				</div>
				<span className="text-default-400 text-small">Total {total} students</span>
			</div>
		),
		[total],
	)

	return (
		<Card>
			<CardBody className="flex flex-col gap-4 p-4">
				{topContent}
				<div className="flex min-h-[647.5px] flex-col justify-between">
					<Table
						aria-label="Students table"
						removeWrapper
						classNames={{
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
							emptyContent={error ? <TableError onRetry={refetch} /> : <StudentsEmptyState />}
							items={error || isLoading ? [] : students}
							isLoading={isLoading}
							loadingContent={<Spinner size="lg" />}
						>
							{(student) => (
								<TableRow key={student.id}>
									{(columnKey) => (
										<TableCell>
											<StudentsTableCell columnKey={columnKey} student={student} />
										</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
					{totalPages > 1 && (
						<div className="flex w-full justify-center pt-4">
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
					)}
				</div>
			</CardBody>
		</Card>
	)
}

export default StudentsTable
