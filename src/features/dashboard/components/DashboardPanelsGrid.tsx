import { Accordion, Avatar, Card, ProgressBar } from "@heroui/react"
import * as React from "react"
import { useTranslation } from "react-i18next"

import MdiChevronRight from "~icons/mdi/chevron-right"

import {
	activityRooms,
	attentionItems,
	financeCards,
	panelCardClassName,
	roomsStatus,
	upcomingEvents,
} from "../constants"
import { getAvatarUrl, getInitials, getRatioClassName } from "../utils"

import AvatarStack from "./AvatarStack"
import DashboardLink from "./DashboardLink"

const RoomsStatusCard = () => {
	const { t } = useTranslation()

	return (
		<Card className={`${panelCardClassName} col-span-1 p-0 lg:col-span-2`}>
			<div className="p-6">
				<h2 className="font-semibold text-[#18181b] text-[16px]">{t("dashboard.roomsStatus.title")}</h2>

				<div className="mt-4 overflow-hidden rounded-[16px]">
					<div className="grid grid-cols-[1.4fr_0.7fr_1fr_0.7fr_1fr_0.5fr] gap-3 px-4 py-2 font-medium text-[#71717a] text-[10px]">
						<span>{t("dashboard.roomsStatus.columns.room")}</span>
						<span>{t("dashboard.roomsStatus.columns.studentsSignedIn")}</span>
						<span />
						<span>{t("dashboard.roomsStatus.columns.staffSignedIn")}</span>
						<span />
						<span>{t("dashboard.roomsStatus.columns.ratio")}</span>
					</div>

					<div className="space-y-1">
						{roomsStatus.map((room) => {
							return (
								<div
									className="grid grid-cols-[1.4fr_0.7fr_1fr_0.7fr_1fr_0.5fr] items-center gap-3 rounded-[14px] px-4 py-2"
									key={room.id}
								>
									<div className="flex items-center gap-3">
										<div className="flex size-6 items-center justify-center rounded-full bg-[#ebebec]">
											<span className="font-semibold text-[#71717a] text-[10px]">{room.room[0]}</span>
										</div>
										<span className="font-medium text-[#18181b] text-[13px]">{room.room}</span>
									</div>
									<span className="font-semibold text-[#18181b] text-[13px]">{room.studentsSignedIn}</span>
									<AvatarStack maxVisible={2} people={room.students} sizeClassName="size-6" />
									<span className="font-semibold text-[#18181b] text-[13px]">{room.staffSignedIn}</span>
									<AvatarStack maxVisible={2} people={room.staff} sizeClassName="size-6" />
									<span
										className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 font-medium text-[11px] ${getRatioClassName(room.ratioTone)}`}
									>
										{room.ratio}
									</span>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</Card>
	)
}

const UpcomingCard = () => {
	const { t } = useTranslation()

	return (
		<Card className={`${panelCardClassName} p-0`}>
			<div className="flex h-full min-h-[220px] flex-col p-6">
				<h2 className="font-semibold text-[#18181b] text-[16px]">{t("dashboard.upcoming.title")}</h2>

				<div className="mt-4 space-y-4">
					{upcomingEvents.map((event) => (
						<div className="flex items-center gap-3" key={`${event.day}-${event.date}-${event.label}`}>
							<div className="w-9 text-center">
								<p className="font-medium text-[#71717a] text-[11px]">{event.day}</p>
								<p className="font-semibold text-[#0485f7] text-[20px] leading-none">{event.date}</p>
							</div>
							<div>
								<p className="font-semibold text-[#18181b] text-[14px]">{event.label}</p>
								<p className="text-[#71717a] text-[12px]">{event.time}</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-auto flex justify-end">
					<DashboardLink to="/calendar">{t("dashboard.upcoming.viewCalendar")}</DashboardLink>
				</div>
			</div>
		</Card>
	)
}

const AttentionCard = () => {
	const { t } = useTranslation()

	return (
		<Card className={`${panelCardClassName} p-0`}>
			<div className="flex h-full min-h-[190px] flex-col p-6">
				<h2 className="font-semibold text-[#18181b] text-[16px]">{t("dashboard.attention.title")}</h2>

				<div className="mt-4 space-y-4">
					{attentionItems.map((item) => (
						<div className="flex items-center gap-3" key={item.name}>
							<Avatar className="size-8" size="sm">
								<Avatar.Image alt={item.name} src={getAvatarUrl(item.seed)} />
								<Avatar.Fallback className="bg-[#ebebec] font-medium text-[#18181b] text-[11px]">
									{getInitials(item.name)}
								</Avatar.Fallback>
							</Avatar>
							<div>
								<p className="font-semibold text-[#18181b] text-[14px]">{item.name}</p>
								<p className="text-[#ff383c] text-[12px]">{item.description}</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-auto flex justify-end">
					<DashboardLink to="/reports">{t("dashboard.attention.viewMore")}</DashboardLink>
				</div>
			</div>
		</Card>
	)
}

const FinanceCardBlock = ({ card }: { card: (typeof financeCards)[number] }) => {
	const { t } = useTranslation()

	return (
		<Card className={`${panelCardClassName} p-0`}>
			<div className="grid h-full min-h-[190px] grid-rows-[auto_1fr_auto] p-6">
				<h2 className="font-semibold text-[#18181b] text-[14px]">{t(card.labelKey)}</h2>
				<div className="flex items-center justify-center">
					<div>
						<p className={`text-center font-semibold text-[22px] sm:text-[40px] ${card.accentClassName}`}>
							{card.value}
						</p>
						<p className="mt-1 text-center text-[#71717a] text-[12px]">{t(card.supportingTextKey)}</p>
					</div>
				</div>
				<div className="flex justify-end">
					<DashboardLink to="/billing">{t(card.actionLabelKey)}</DashboardLink>
				</div>
			</div>
		</Card>
	)
}

const ActivitiesCard = () => {
	const { t } = useTranslation()
	const [expandedKeys, setExpandedKeys] = React.useState(new Set<string>(["baby-turtles"]))

	return (
		<Card className={`${panelCardClassName} col-span-1 p-0 lg:col-span-2`}>
			<div className="min-h-[420px] p-6">
				<h2 className="font-semibold text-[#18181b] text-[16px]">{t("dashboard.activities.title")}</h2>

				<Accordion
					className="mt-4 w-full"
					expandedKeys={expandedKeys}
					hideSeparator
					onExpandedChange={(keys) => setExpandedKeys(new Set(Array.from(keys) as string[]))}
				>
					{activityRooms.map((room, roomIndex) => {
						const isExpanded = expandedKeys.has(room.id)

						return (
							<Accordion.Item
								className={roomIndex < activityRooms.length - 1 ? "border-[rgba(0,0,0,0.08)] border-b" : ""}
								id={room.id}
								key={room.id}
							>
								<Accordion.Heading>
									<Accordion.Trigger className="flex items-center gap-2 px-0 py-2 hover:bg-transparent">
										<div className="flex flex-1 items-center gap-2">
											<MdiChevronRight
												className={`size-4 text-[#71717a] transition-transform duration-200 ease-out ${
													isExpanded ? "rotate-90" : "rotate-0"
												}`}
											/>
											<span className="font-semibold text-[#18181b] text-[14px]">{room.name}</span>
										</div>
										<p className="text-[#71717a] text-[13px]">{room.count}</p>
									</Accordion.Trigger>
								</Accordion.Heading>
								<Accordion.Panel>
									<Accordion.Body className="space-y-3 px-0 pt-0 pb-3 pl-6">
										{room.entries?.map((entry) => {
											const Icon = entry.icon

											return (
												<div className="grid grid-cols-[20px_72px_1fr_24px] items-center gap-3" key={entry.label}>
													<Icon className="size-4 text-[#0485f7]" />
													<p className="font-medium text-[#18181b] text-[13px]">{entry.label}</p>
													<ProgressBar
														aria-label={t("dashboard.activities.progressAria", { label: entry.label })}
														className="w-full"
														value={entry.progress}
													>
														<ProgressBar.Track className="h-1 bg-[#ebebec]">
															<ProgressBar.Fill className="rounded-full bg-[#0485f7]" />
														</ProgressBar.Track>
													</ProgressBar>
													<p className="text-right font-semibold text-[#18181b] text-[13px]">{entry.count}</p>
												</div>
											)
										})}
									</Accordion.Body>
								</Accordion.Panel>
							</Accordion.Item>
						)
					})}
				</Accordion>
			</div>
		</Card>
	)
}

const DashboardPanelsGrid = () => (
	<div className="mt-6 grid gap-4 lg:grid-cols-3">
		<RoomsStatusCard />
		<UpcomingCard />
		{financeCards.map((card) => (
			<FinanceCardBlock card={card} key={card.labelKey} />
		))}
		<AttentionCard />
		<ActivitiesCard />
	</div>
)

export default DashboardPanelsGrid
