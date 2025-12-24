import { Avatar, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"

import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"
import TablerTrash from "~icons/tabler/trash"

import { getEmployeeAvatarUrl, getEmployeeFullName } from "../../types"

import type { EmployeeSummary } from "../../types"

interface RenderCellOptions {
	onEmployeeClick: (id: string) => void
}

export function renderCell(employee: EmployeeSummary, columnKey: React.Key, options: RenderCellOptions) {
	const { onEmployeeClick } = options
	const fullName = getEmployeeFullName(employee)
	const avatarUrl = getEmployeeAvatarUrl(employee)

	switch (columnKey) {
		case "employee":
			return (
				<button
					className="flex cursor-pointer items-center gap-3 text-left"
					onClick={() => onEmployeeClick(employee.id)}
					type="button"
				>
					<Avatar alt={fullName} showFallback size="sm" src={avatarUrl} />
					<div className="flex flex-col">
						<span className="font-medium text-sm hover:text-brand hover:underline">{fullName}</span>
						{employee.checkedIn && <span className="text-green-500 text-xs">Checked in</span>}
					</div>
				</button>
			)

		case "role":
			return <span className="text-gray-600 text-sm capitalize">{employee.role}</span>

		case "email":
			return <span className="text-gray-500 text-sm">{employee.email ?? "—"}</span>

		case "status": {
			const isActive = employee.status === "active"
			return (
				<Chip
					className={isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
					size="sm"
					variant="flat"
				>
					{employee.status}
				</Chip>
			)
		}

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown classNames={{ content: "min-w-0" }}>
						<DropdownTrigger>
							<Button isIconOnly radius="md" variant="light">
								<svg
									aria-hidden="true"
									className="size-5 text-gray-600"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									viewBox="0 0 24 24"
								>
									<circle cx={12} cy={12} r={1} />
									<circle cx={12} cy={5} r={1} />
									<circle cx={12} cy={19} r={1} />
								</svg>
							</Button>
						</DropdownTrigger>
						<DropdownMenu aria-label="Employee actions">
							<DropdownItem
								key="view"
								className="text-success"
								startContent={<TablerEye aria-hidden className="size-5" />}
							>
								View
							</DropdownItem>
							<DropdownItem
								key="edit"
								className="text-warning"
								startContent={<TablerEdit aria-hidden className="size-5" />}
							>
								Edit
							</DropdownItem>
							<DropdownItem
								key="deactivate"
								className="text-danger"
								startContent={<TablerTrash aria-hidden className="size-5" />}
							>
								Deactivate
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}
