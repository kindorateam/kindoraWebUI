import {
	Avatar,
	Badge,
	Button,
	Chip,
	Label,
	ListBox,
	Popover,
	RangeCalendar,
	Select,
	Separator,
	Tabs,
	Tooltip,
} from "@heroui/react"
import { useTranslation } from "react-i18next"

import IdentityChip from "@/components/IdentityChip"
import { ABSENCE_REASONS } from "@/features/rooms/constants"
import FluentPerson16Filled from "~icons/fluent/person-16-filled"
import GrommetIconsUpdate from "~icons/grommet-icons/update"
import MingcuteSendFill from "~icons/mingcute/send-fill"
import PhSignInBold from "~icons/ph/sign-in-bold"
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
	const { t } = useTranslation()
	const fullName = employeeData ? getEmployeeFullName(employeeData) : "Employee"
	const avatarUrl = employeeData ? getEmployeeAvatarUrl(employeeData) : undefined
	const absenceDate = "Nov 20 - Nov 26"

	return (
		<div>
			<div className="container mx-auto max-w-4xl">
				<div className="mb-8 flex items-start gap-10">
					{/* Avatar with online/offline status badge */}
					<div className="relative shrink-0">
						<Badge.Anchor>
							<Avatar className="size-25 shadow-md">
								<Avatar.Image alt={fullName} src={avatarUrl} />
								<Avatar.Fallback className="bg-accent text-white">
									<FluentPerson16Filled className="size-22 text-white" />
								</Avatar.Fallback>
							</Avatar>
							<Badge
								color={employeeData?.checkedIn ? "success" : "danger"}
								className="h-6! min-h-0! w-6! min-w-0! border-3 border-white"
								placement="bottom-right"
							/>
						</Badge.Anchor>
					</div>

					{/* Info column */}
					<div className="flex min-w-0 flex-1 flex-col gap-5">
						{/* Name + Separator */}
						<div className="flex flex-col gap-1">
							<div className="flex items-start justify-between gap-4">
								<h1 className="font-semibold text-4xl">{fullName}</h1>
								<div className="flex shrink-0 gap-3">
									<Button className="bg-success text-white hover:bg-success/90" onPress={onSendInvite} size="sm">
										<MingcuteSendFill aria-hidden className="size-4" />
										Send Invite
									</Button>
									<Button variant="primary" onPress={onSignOut} size="sm">
										<PhSignInBold aria-hidden className="size-4" />
										Sign Out
									</Button>
								</div>
							</div>
							<Separator />
						</div>

						{/* Row 1: Role, Pin, Rooms */}
						<div className="flex items-center">
							<div className="flex items-center gap-7">
								{/* Role */}
								{employeeData?.role && (
									<div className="flex items-center gap-2">
										<span>Role:</span>
										<Chip
											className="bg-[#792C410D] px-3 py-1 text-sm capitalize"
											style={{ color: "var(--colors-base-secondary, #7828C8)" }}
											variant="soft"
										>
											{employeeData.role}
										</Chip>
									</div>
								)}

								{/* Pin + Generate button */}
								{employeeData?.pinCode != null && (
									<div className="flex items-center gap-2">
										<span>Pin:</span>
										<Chip
											className="bg-[#792C410D] px-3 py-1 font-medium text-sm"
											style={{ color: "var(--colors-base-secondary, #7828C8)" }}
											variant="soft"
										>
											{employeeData.pinCode}
										</Chip>
										{/* TODO: Wire to generate pin API when available */}
										<Tooltip delay={0}>
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
									<span className="shrink-0">Rooms:</span>
									<div className="flex min-w-0 items-center gap-2">
										{MOCK_ROOMS.slice(0, 2).map((room) => (
											<IdentityChip
												fallbackIcon="room"
												fullName={room.label}
												key={room.key}
												src={room.avatar || undefined}
											/>
										))}
										{MOCK_ROOMS.length > 2 && (
											<Tooltip delay={0}>
												<Button variant="secondary" size="sm" className="h-7 min-w-0 rounded-full px-3">
													+{MOCK_ROOMS.length - 2}
												</Button>
												<Tooltip.Content className="flex flex-col gap-2 p-3">
													{MOCK_ROOMS.slice(2).map((room) => (
														<IdentityChip
															fallbackIcon="room"
															fullName={room.label}
															key={room.key}
															src={room.avatar || undefined}
														/>
													))}
												</Tooltip.Content>
											</Tooltip>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Row 2: Absence */}
						{/* TODO: Replace mock absence data with API data when available */}
						{absenceDate && (
							<div className="flex items-center gap-3">
								<span className="shrink-0">Absence date:</span>
								<Chip
									className="bg-[#792C410D] px-3 py-1 font-medium text-sm"
									style={{ color: "var(--colors-base-secondary, #7828C8)" }}
									variant="soft"
								>
									{absenceDate}
								</Chip>
								<Popover>
									<Popover.Trigger>
										<Button aria-label="Set absence dates" variant="primary" isIconOnly size="sm">
											<SolarCalendarBroken className="size-4" />
										</Button>
									</Popover.Trigger>
									<Popover.Content>
										<Popover.Dialog>
											<div className="flex flex-col gap-4">
												<Select defaultValue="vacation" variant="secondary">
													<Label>Reason</Label>
													<Select.Trigger>
														<Select.Value />
														<Select.Indicator />
													</Select.Trigger>
													<Select.Popover>
														<ListBox>
															{ABSENCE_REASONS.map((item) => (
																<ListBox.Item id={item.key} key={item.key} textValue={t(item.labelKey)}>
																	{t(item.labelKey)}
																	<ListBox.ItemIndicator />
																</ListBox.Item>
															))}
														</ListBox>
													</Select.Popover>
												</Select>
												<RangeCalendar aria-label="Absence date range">
													<RangeCalendar.Header>
														<RangeCalendar.Heading />
														<RangeCalendar.NavButton slot="previous" />
														<RangeCalendar.NavButton slot="next" />
													</RangeCalendar.Header>
													<RangeCalendar.Grid>
														<RangeCalendar.GridHeader>
															{(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
														</RangeCalendar.GridHeader>
														<RangeCalendar.GridBody>
															{(date) => <RangeCalendar.Cell date={date} />}
														</RangeCalendar.GridBody>
													</RangeCalendar.Grid>
												</RangeCalendar>
											</div>
										</Popover.Dialog>
									</Popover.Content>
								</Popover>
							</div>
						)}
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
