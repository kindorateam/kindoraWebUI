import { Avatar, Badge, Button, Dropdown, Label } from "@heroui/react"

import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"
import TablerTrash from "~icons/tabler/trash"

import { getEmployeeAvatarUrl, getEmployeeFullName } from "../../types"

import PinCell from "./PinCell"

import type { EmployeeSummary } from "../../types"

interface RenderCellOptions {
	onEmployeeClick: (id: string) => void
}

export function renderCell(employee: EmployeeSummary, columnKey: React.Key, options: RenderCellOptions) {
	const { onEmployeeClick } = options
	const fullName = getEmployeeFullName(employee)
	const avatarUrl = getEmployeeAvatarUrl(employee)
	const roomLabel = Array.isArray(employee.rooms)
		? employee.rooms
				.map((room) => room.title)
				.filter(Boolean)
				.join(", ")
		: "No rooms"

	switch (columnKey) {
		case "employee":
			return (
				<button
					className="flex cursor-pointer items-center gap-3 text-left"
					onClick={() => onEmployeeClick(employee.id)}
					type="button"
				>
					<Badge.Anchor>
						<Avatar size="sm">
							<Avatar.Image alt={fullName} src={avatarUrl} />
							<Avatar.Fallback>{fullName.charAt(0)}</Avatar.Fallback>
						</Avatar>
						<Badge color={employee.checkedIn ? "success" : "danger"} />
					</Badge.Anchor>
					<div className="flex flex-col">
						<span className="font-medium text-sm hover:text-brand hover:underline">{fullName}</span>
					</div>
				</button>
			)

		case "role":
			return <span className="text-gray-600 text-sm capitalize">{employee.role}</span>

		case "pin":
			return <PinCell pinCode={employee.pinCode} />

		case "room":
			return <span className="text-gray-500 text-sm">{roomLabel}</span>

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown className="min-w-0">
						<Dropdown.Trigger>
							<Button isIconOnly variant="ghost">
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
						</Dropdown.Trigger>
						<Dropdown.Popover>
							<Dropdown.Menu aria-label="Employee actions">
								<Dropdown.Item
									id="view"
									textValue="View"
									className="text-success"

								>
									<Label>View</Label>
								</Dropdown.Item>
								<Dropdown.Item
									id="edit"
									textValue="Edit"
									className="text-warning"

								>
									<Label>Edit</Label>
								</Dropdown.Item>
								<Dropdown.Item
									id="deactivate"
									textValue="Deactivate"
									className="text-danger"

								>
									<Label>Deactivate</Label>
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown.Popover>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}
