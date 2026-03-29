import {
	Avatar,
	Badge,
	Button,
	Calendar,
	Chip,
	Label,
	ListBox,
	Popover,
	Select,
	Separator,
	Tabs,
	Tooltip,
} from "@heroui/react"

import IdentityChip from "@/components/IdentityChip"
import { ABSENCE_REASONS } from "@/features/rooms/constants"
import GrommetIconsUpdate from "~icons/grommet-icons/update"
import SolarCalendarBroken from "~icons/solar/calendar-broken"

import { MOCK_ROOMS } from "../../constants"
import { getEmployeeAvatarUrl, getEmployeeFullName } from "../../types"

import type { EmployeeFull } from "../../types"

type TabType = "profile" | "documents"

interface StaffDetailHeaderProps {
	employeeData: EmployeeFull | undefined
	activeTab: TabType
	onTabChange: (tab: TabType) => void
	onSignOut?: () => void
	onGeneratePin?: () => void
	onSendInvite?: () => void
}

const StaffDetailHeader = ({
	employeeData,
	activeTab,
	onTabChange,
	onSignOut,
	onGeneratePin,
	onSendInvite,
}: StaffDetailHeaderProps) => {
	const fullName = employeeData ? getEmployeeFullName(employeeData) : "Employee"
	const avatarUrl = employeeData ? getEmployeeAvatarUrl(employeeData) : undefined

	return (
		<div>
			<div className="container mx-auto max-w-4xl">
				<div className="mb-7 flex items-start justify-between gap-10">
					<div className="flex items-start gap-10">
						{/* Avatar with online/offline status badge */}
						<div className="relative shrink-0">
							<Badge.Anchor>
								<Avatar className="size-25 border-4 border-white shadow-md">
									<Avatar.Image alt={fullName} src={avatarUrl} />
									<Avatar.Fallback>{fullName.charAt(0)}</Avatar.Fallback>
								</Avatar>
								<Badge color={employeeData?.checkedIn ? "success" : "danger"} />
							</Badge.Anchor>
						</div>

						{/* Info column */}
						<div className="flex flex-col gap-5">
							{/* Name + Separator */}
							<div className="flex flex-col gap-1">
								<h1 className="font-semibold text-4xl">{fullName}</h1>
								<Separator />
							</div>

							{/* Row 1: Role, Pin, Rooms */}
							<div className="flex items-center">
								<div className="flex items-center gap-7">
									{/* Role */}
									{employeeData?.role && (
										<div className="flex items-center gap-2">
											<span className="text-neutral-600 text-sm">Role</span>
											<Chip
												className="bg-secondary-50 font-medium text-secondary text-sm capitalize"
												size="sm"
												variant="soft"
											>
												{employeeData.role}
											</Chip>
										</div>
									)}

									{/* Pin + Generate button */}
									{employeeData?.pinCode != null && (
										<div className="flex items-center gap-2">
											<span className="text-neutral-600 text-sm">Pin</span>
											<Chip className="bg-secondary-50 font-medium text-secondary text-sm" size="sm" variant="soft">
												{employeeData.pinCode}
											</Chip>
											{/* TODO: Wire to generate pin API when available */}
											<Tooltip>
												<Button
													aria-label="Generate new pin"
													variant="primary"
													isIconOnly
													onPress={onGeneratePin}
													className="rounded-full"
													size="sm"
												>
													<GrommetIconsUpdate className="size-4" />
												</Button>
												<Tooltip.Content>Generate new pin</Tooltip.Content>
											</Tooltip>
										</div>
									)}

									{/* Rooms */}
									{/* TODO: Replace MOCK_ROOMS with actual room data from API */}
									<div className="flex items-center gap-2">
										<span className="text-neutral-600 text-sm">Rooms</span>
										<div className="grid grid-cols-2 gap-x-4 gap-y-2">
											{MOCK_ROOMS.map((room) => (
												<IdentityChip fullName={room.label} key={room.key} src={room.avatar || undefined} />
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Row 2: Absence */}
							{/* TODO: Replace mock absence data with API data when available */}
							<div className="flex items-center gap-3">
								<span className="shrink-0 text-neutral-600 text-sm">Absence date</span>
								<Chip className="bg-secondary-50 font-medium text-secondary text-sm" size="sm" variant="soft">
									Nov 20 - Nov 26
								</Chip>
								<Popover>
									<Popover.Trigger>
										<Button aria-label="Set absence dates" variant="primary" isIconOnly size="sm">
											<SolarCalendarBroken className="size-4" />
										</Button>
									</Popover.Trigger>
									<Popover.Content className="p-4">
										<Popover.Dialog>
											<div className="flex flex-col gap-4">
												<Select defaultValue="vacation">
													<Label>Reason</Label>
													<Select.Trigger>
														<Select.Value />
														<Select.Indicator />
													</Select.Trigger>
													<Select.Popover>
														<ListBox>
															{ABSENCE_REASONS.map((item) => (
																<ListBox.Item id={item.key} key={item.key} textValue={item.label}>
																	{item.label}
																	<ListBox.ItemIndicator />
																</ListBox.Item>
															))}
														</ListBox>
													</Select.Popover>
												</Select>
												<Calendar aria-label="Absence date" />
											</div>
										</Popover.Dialog>
									</Popover.Content>
								</Popover>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-3">
						{/* Sign Out button */}
						<Button variant="primary" onPress={onSignOut}>
							Sign Out
						</Button>
						{/* Send Invite */}
						{/* TODO: Wire to send invite API when available */}
						<Button className="text-white" variant="primary" onPress={onSendInvite} size="sm">
							Send Invite
						</Button>
					</div>
				</div>

				<Tabs onSelectionChange={(key) => onTabChange(key as TabType)} selectedKey={activeTab}>
					<Tabs.ListContainer>
						<Tabs.List
							aria-label="Employee details tabs"
							className="w-fit *:h-6 *:w-fit *:px-3 *:font-normal *:text-sm *:data-[selected=true]:text-accent-foreground"
						>
							<Tabs.Tab id="profile">
								Profile
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
							<Tabs.Tab id="documents">
								Documents
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
						</Tabs.List>
					</Tabs.ListContainer>
					<Tabs.Panel id="profile" className="hidden">
						{null}
					</Tabs.Panel>
					<Tabs.Panel id="documents" className="hidden">
						{null}
					</Tabs.Panel>
				</Tabs>
			</div>
		</div>
	)
}

export default StaffDetailHeader
