import { Avatar, Button, Chip, Divider } from "@heroui/react"

import SignOutIcon from "@/components/icons/SignOutIcon"

import { getEmployeeAvatarUrl, getEmployeeFullName } from "../../types"

import type { EmployeeFull } from "../../types"

interface StaffDetailHeaderProps {
	employeeData: EmployeeFull | undefined
	tabs: React.ReactNode
	onSignOut?: () => void
}

const StaffDetailHeader = ({ employeeData, tabs, onSignOut }: StaffDetailHeaderProps) => {
	const employee = employeeData?.employee
	const fullName = employee ? getEmployeeFullName(employee) : "Employee"
	const avatarUrl = employee ? getEmployeeAvatarUrl(employee) : undefined

	return (
		<div>
			<div className="container mx-auto max-w-4xl">
				<div className="mb-7 flex items-start justify-between gap-10">
					<div className="flex items-center gap-10">
						<Avatar className="size-25 shrink-0 border-4 border-white shadow-md" showFallback src={avatarUrl} />
						<div className="flex flex-col gap-5">
							<div className="flex flex-col gap-1">
								<h1 className="font-semibold text-4xl">{fullName}</h1>
								<Divider />
							</div>

							<div className="flex items-center gap-2">
								{employee?.role && (
									<div className="flex items-center gap-2">
										<span className="text-neutral-600 text-sm">Role</span>
										<Chip
											className="bg-secondary-50 font-medium text-secondary text-sm capitalize"
											size="sm"
											variant="flat"
										>
											{employee.role}
										</Chip>
									</div>
								)}
								{employee?.pinCode !== null && employee?.pinCode !== undefined && (
									<div className="flex items-center gap-2 pl-2">
										<span className="text-neutral-600 text-sm">Pin</span>
										<Chip className="bg-secondary-50 font-medium text-secondary text-sm" size="sm" variant="flat">
											{employee.pinCode}
										</Chip>
									</div>
								)}
							</div>
						</div>
					</div>

					<Button color="primary" endContent={<SignOutIcon fill="#fff" />} onPress={onSignOut}>
						Sign Out
					</Button>
				</div>

				{tabs}
			</div>
		</div>
	)
}

export default StaffDetailHeader
