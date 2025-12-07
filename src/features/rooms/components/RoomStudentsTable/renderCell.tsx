import { Avatar, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"

import PhCheckCircleBold from "~icons/ph/check-circle-bold"
import PhSignOutBold from "~icons/ph/sign-out-bold"
import SolarCalendarBroken from "~icons/solar/calendar-broken"
import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"

import type { Student } from "../../types"

export function renderCell(student: Student, columnKey: React.Key) {
	switch (columnKey) {
		case "student":
			return (
				<div className="flex items-center gap-3">
					<Avatar alt={student.name} showFallback size="sm" src={student.avatar} />
					<span className="font-medium text-sm">{student.name}</span>
				</div>
			)

		case "parents":
			return (
				<div className="flex flex-wrap gap-1">
					{student.parents.length > 0 ? (
						student.parents.map((parent) => (
							<span key={parent.id} className="text-gray-600 text-sm">
								{parent.name}
							</span>
						))
					) : (
						<span className="text-gray-400 text-sm">No parents assigned</span>
					)}
				</div>
			)

		case "tags":
			return (
				<div className="flex flex-wrap gap-1">
					{student.tags.length > 0 ? (
						student.tags.map((tag) => (
							<Chip key={tag} className="bg-gray-100 text-gray-600" size="sm">
								{tag}
							</Chip>
						))
					) : (
						<span className="text-gray-400 text-sm">No tags</span>
					)}
				</div>
			)

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
						<DropdownMenu aria-label="Student actions">
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
								key="check"
								className="text-primary"
								startContent={
									student.checkedIn ? (
										<PhSignOutBold aria-hidden className="size-5" />
									) : (
										<PhCheckCircleBold aria-hidden className="size-5" />
									)
								}
							>
								{student.checkedIn ? "Check out" : "Check in"}
							</DropdownItem>
							<DropdownItem key="absent" startContent={<SolarCalendarBroken aria-hidden className="size-5" />}>
								Mark absent
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}
