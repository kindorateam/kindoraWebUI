import { Avatar, Button, Chip, Divider, Select, SelectItem } from "@heroui/react"

import IdentityChip from "@/components/IdentityChip"
import SignOutIcon from "@/components/icons/SignOutIcon"
import { ABSENCE_REASONS } from "@/features/rooms/constants"
import SolarCalendarBroken from "~icons/solar/calendar-broken"
import TablerRefresh from "~icons/tabler/refresh"
import TablerSend2 from "~icons/tabler/send-2"

import { MOCK_ROOMS } from "../../constants"
import { getEmployeeAvatarUrl, getEmployeeFullName } from "../../types"

import type { EmployeeFull } from "../../types"

interface StaffDetailHeaderProps {
	employeeData: EmployeeFull | undefined
	tabs: React.ReactNode
	onSignOut?: () => void
	onGeneratePin?: () => void
	onSendInvite?: () => void
}

const StaffDetailHeader = ({ employeeData, tabs, onSignOut, onGeneratePin, onSendInvite }: StaffDetailHeaderProps) => {
	const fullName = employeeData ? getEmployeeFullName(employeeData) : "Employee"
	const avatarUrl = employeeData ? getEmployeeAvatarUrl(employeeData) : undefined

	return (
		<div>
			<div className="container mx-auto max-w-4xl">
				<div className="mb-7 flex items-start justify-between gap-10">
					<div className="flex items-start gap-10">
						{/* Avatar with checked-in status dot */}
						<div className="relative shrink-0">
							<Avatar className="size-25 border-4 border-white shadow-md" showFallback src={avatarUrl} />
							{employeeData?.checkedIn && (
								<span className="absolute right-0 bottom-0 size-6 rounded-full border-2 border-white bg-success" />
							)}
						</div>

						{/* Info column */}
						<div className="flex flex-col gap-5">
							{/* Name + Divider */}
							<div className="flex flex-col gap-1">
								<h1 className="font-semibold text-4xl">{fullName}</h1>
								<Divider />
							</div>

							{/* Row 1: Role, Pin, Rooms + Send Invite */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-7">
									{/* Role */}
									{employeeData?.role && (
										<div className="flex items-center gap-2">
											<span className="text-neutral-600 text-sm">Role</span>
											<Chip
												className="bg-secondary-50 font-medium text-secondary text-sm capitalize"
												size="sm"
												variant="flat"
											>
												{employeeData.role}
											</Chip>
										</div>
									)}

									{/* Pin + Generate button */}
									{employeeData?.pinCode != null && (
										<div className="flex items-center gap-2">
											<span className="text-neutral-600 text-sm">Pin</span>
											<Chip className="bg-secondary-50 font-medium text-secondary text-sm" size="sm" variant="flat">
												{employeeData.pinCode}
											</Chip>
											{/* TODO: Wire to generate pin API when available */}
											<Button
												aria-label="Generate new pin"
												color="primary"
												isIconOnly
												onPress={onGeneratePin}
												radius="full"
												size="sm"
											>
												<TablerRefresh className="size-4" />
											</Button>
										</div>
									)}

									{/* Rooms */}
									{/* TODO: Replace MOCK_ROOMS with actual room data from API */}
									<div className="flex items-center gap-2">
										<span className="text-neutral-600 text-sm">Rooms</span>
										<div className="flex gap-1">
											{MOCK_ROOMS.map((room) => (
												<IdentityChip fullName={room.label} key={room.key} src={room.avatar || undefined} />
											))}
										</div>
									</div>
								</div>

								{/* Send Invite */}
								{/* TODO: Wire to send invite API when available */}
								<Button
									color="success"
									endContent={<TablerSend2 className="size-4" />}
									onPress={onSendInvite}
									radius="md"
									size="sm"
								>
									Send Invite
								</Button>
							</div>

							{/* Row 2: Absence */}
							{/* TODO: Replace mock absence data with API data when available */}
							<div className="flex items-center gap-4">
								<div className="flex flex-1 items-center gap-3">
									<span className="shrink-0 text-neutral-600 text-sm">Absence date</span>
									<Chip className="flex-1 bg-secondary-50 font-medium text-secondary text-sm" size="sm" variant="flat">
										Nov 20 - Nov 26
									</Chip>
									<Button aria-label="Set absence dates" color="primary" isIconOnly radius="full" size="sm">
										<SolarCalendarBroken className="size-4" />
									</Button>
								</div>

								<Select className="flex-1" defaultSelectedKeys={["vacation"]} label="Reason" radius="md" size="sm">
									{ABSENCE_REASONS.map((item) => (
										<SelectItem key={item.key}>{item.label}</SelectItem>
									))}
								</Select>
							</div>
						</div>
					</div>

					{/* Sign Out button */}
					<Button color="primary" endContent={<SignOutIcon fill="#fff" />} onPress={onSignOut} radius="md">
						Sign Out
					</Button>
				</div>

				{tabs}
			</div>
		</div>
	)
}

export default StaffDetailHeader
