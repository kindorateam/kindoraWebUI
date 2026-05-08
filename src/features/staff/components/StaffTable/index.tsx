import { Button, EmptyState, Label, Pagination, Spinner, Switch, Table } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import TableError from "@/components/TableError"
import ClarityEmployeeLine from "~icons/clarity/employee-line"
import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"

import { useEmployees } from "../../hooks/useStaff"
import { openAddStaffModal } from "../../stores/addStaffModal.store"
import AddStaffModal from "../AddStaffModal"

import columns from "./columns"
import { renderCell } from "./renderCell"

const StaffTable = () => {
	const { i18n, t } = useTranslation()
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
	const hasError = Boolean(error)
	const showLoading = isLoading
	const isEmpty = !showLoading && !hasError && items.length === 0

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
					<Label className="text-sm">{t("staff.table.viewDeactivated")}</Label>
				</Switch.Content>
			</Switch>
			<Button variant="primary" onPress={openAddStaffModal}>
				<OcticonFeedPlus16 aria-hidden className="size-4" />
				{t("staff.addStaff.title")}
			</Button>
		</div>
	)

	const renderCellOptions = { onEmployeeClick: handleEmployeeClick }
	const emptyStateContent = showDeactivated ? (
		<EmptyState className="flex h-125 w-full flex-col items-center justify-center gap-5 py-8 text-center">
			<ClarityEmployeeLine aria-hidden className="size-20" />
			<h3 className="font-semibold text-3xl leading-9">{t("staff.emptyState.noDeactivated")}</h3>
		</EmptyState>
	) : (
		<EmptyState className="flex h-125 w-full items-center justify-center text-default-400">
			{t("staff.emptyState.title")}
		</EmptyState>
	)

	return (
		<>
			<AddStaffModal />
			<div className="flex flex-col gap-4">
				{topContent}
				<Table className="[&_td]:py-1.5! [&_tr]:h-12.5!">
					<div className="relative">
						<Table.ScrollContainer className="min-h-140">
							<Table.Content key={i18n.language} aria-label={t("staff.table.ariaLabel")}>
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
								{showLoading || hasError || isEmpty ? (
									<Table.Body />
								) : (
									<Table.Body items={items}>
										{(employee) => (
											<Table.Row id={employee.id}>
												<Table.Collection items={columns}>
													{(column) => (
														<Table.Cell>{renderCell(employee, column.key, renderCellOptions, t)}</Table.Cell>
													)}
												</Table.Collection>
											</Table.Row>
										)}
									</Table.Body>
								)}
							</Table.Content>
						</Table.ScrollContainer>
						{showLoading && (
							<div className="pointer-events-none absolute inset-x-0 top-12.5 bottom-1 flex items-center justify-center overflow-hidden rounded-[calc(var(--radius)*2)] bg-white">
								<Spinner />
							</div>
						)}
						{hasError && (
							<div className="absolute inset-x-0 top-12.5 h-125 overflow-hidden rounded-[calc(var(--radius)*2)] bg-white">
								<div className="flex h-125 items-center justify-center px-4 py-8">
									<TableError onRetry={refetch} />
								</div>
							</div>
						)}
						{isEmpty && (
							<div className="absolute inset-x-0 top-12.5 h-125 overflow-hidden rounded-[calc(var(--radius)*2)] bg-white">
								{emptyStateContent}
							</div>
						)}
					</div>
					<Table.Footer>
						<Pagination className="w-full">
							<Pagination.Summary>
								{t("staff.table.paginationSummary", { count: total, endItem, startItem, total })}
							</Pagination.Summary>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.Previous isDisabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
										<Pagination.PreviousIcon />
										<span>{t("common.previous")}</span>
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
										<span>{t("common.next")}</span>
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
