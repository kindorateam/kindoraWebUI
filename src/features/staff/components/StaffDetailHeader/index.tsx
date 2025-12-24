import { Avatar, Button, Chip } from "@heroui/react"
import { useCallback, useState } from "react"

import CalendarPlusIcon from "@/components/icons/CalendarPlusIcon"
import SignOutIcon from "@/components/icons/SignOutIcon"
import MdiEye from "~icons/mdi/eye"
import MdiEyeOff from "~icons/mdi/eye-off"

import { getEmployeeAvatarUrl, getEmployeeFullName } from "../../types"

import type { EmployeeFull } from "../../types"

interface StaffDetailHeaderProps {
	employeeData: EmployeeFull | undefined
	tabs: React.ReactNode
	onSignOut?: () => void
	onMarkAbsent?: () => void
}

const StaffDetailHeader = ({ employeeData, tabs, onSignOut, onMarkAbsent }: StaffDetailHeaderProps) => {
	const [isPinVisible, setIsPinVisible] = useState(false)

	const togglePinVisibility = useCallback(() => {
		setIsPinVisible((prev) => !prev)
	}, [])

	const employee = employeeData?.employee
	const fullName = employee ? getEmployeeFullName(employee) : "Employee"
	const avatarUrl = employee ? getEmployeeAvatarUrl(employee) : undefined
	const displayedPin = isPinVisible ? employee?.pinCode?.toString() : "••••"

	return (
		<div className="border-[#0000000D] border-b">
			<div className="container max-w-4xl">
				<div className="mb-13 flex items-center">
					<div className="flex items-center gap-7">
						<div>
							<Avatar className="size-37.5" showFallback src={avatarUrl} />
						</div>
						<div className="w-full">
							<h1 className="mb-4 font-bold text-4xl">{fullName}</h1>

							<div className="mb-5 flex flex-wrap items-center gap-5">
								{employee?.role && (
									<div className="flex items-center gap-2">
										<span className="text-neutral-800 text-xs">Role</span>
										<Chip className="font-semibold text-xs capitalize" size="sm">
											{employee.role}
										</Chip>
									</div>
								)}
								{employee?.pinCode !== null && employee?.pinCode !== undefined && (
									<div className="flex items-center gap-2">
										<span className="text-neutral-800 text-xs">Pin</span>
										<Chip
											className="font-semibold text-xs"
											endContent={
												<button
													aria-label={isPinVisible ? "Hide PIN" : "Show PIN"}
													className="ml-1 cursor-pointer text-neutral-500 hover:text-neutral-700"
													onClick={togglePinVisibility}
													type="button"
												>
													{isPinVisible ? <MdiEyeOff className="size-4" /> : <MdiEye className="size-4" />}
												</button>
											}
											size="sm"
										>
											{displayedPin}
										</Chip>
									</div>
								)}
								{employee?.status && (
									<div className="flex items-center gap-2">
										<span className="text-neutral-800 text-xs">Status</span>
										<Chip
											className={`font-semibold text-xs capitalize ${
												employee.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
											}`}
											size="sm"
										>
											{employee.status}
										</Chip>
									</div>
								)}
								{employee?.checkedIn && (
									<Chip className="bg-green-100 font-semibold text-green-700 text-xs" size="sm">
										Checked In
									</Chip>
								)}
							</div>
						</div>
					</div>
					<div className="ms-auto flex gap-3.5">
						<Button
							className="ms-auto"
							color="secondary"
							onPress={onMarkAbsent}
							startContent={<CalendarPlusIcon />}
							variant="bordered"
						>
							Mark absent
						</Button>
						<Button color="primary" onPress={onSignOut} startContent={<SignOutIcon fill="#fff" />}>
							Sign Out
						</Button>
					</div>
				</div>

				{tabs}
			</div>
		</div>
	)
}

export default StaffDetailHeader
