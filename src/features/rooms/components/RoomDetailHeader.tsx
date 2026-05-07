import { Avatar, Tabs, Tooltip } from "@heroui/react"
import { useTranslation } from "react-i18next"

import IdentityChip from "@/components/IdentityChip"
import LabeledNumberBadge from "@/components/LabeledNumberBadge"
import { getMediaUrl } from "@/utils/media"
import FluentConferenceRoom20Regular from "~icons/fluent/conference-room-20-regular"
import PhSmileyDuotone from "~icons/ph/smiley-duotone"
import PhSmileySadDuotone from "~icons/ph/smiley-sad-duotone"

import { useRoom } from "../hooks/useRooms"

type TabType = "students" | "activity" | "profile"

interface RoomDetailHeaderProps {
	roomId: string
	activeTab: TabType
	onTabChange: (tab: TabType) => void
}

const RoomDetailHeader = ({ activeTab, roomId, onTabChange }: RoomDetailHeaderProps) => {
	const { t } = useTranslation()
	const { data: room } = useRoom(roomId)

	const signedInCount = room?.signedInStudents.filter((s) => s.checkedIn).length ?? 0
	const studentsCount = room?.studentsCount ?? 0
	const staffCount = room?.staffCount ?? 0
	const ratioValue = room?.ratio ?? 0
	const actualRatio = staffCount > 0 ? studentsCount / staffCount : studentsCount
	const isGoodRatio = actualRatio <= ratioValue
	const formatAgeLabel = (months: number) => {
		const years = Math.floor(months / 12)
		const remainingMonths = months % 12

		if (years === 0) return t("rooms.age.months", { count: months })
		if (remainingMonths === 0) return t("rooms.age.years", { count: years })

		return t("rooms.age.yearsAndMonths", {
			months: t("rooms.age.months", { count: remainingMonths }),
			years: t("rooms.age.years", { count: years }),
		})
	}

	const stats = [
		{ label: t("rooms.detail.stats.capacity"), value: room?.capacity ?? 0, badgeVariant: "circle" as const },
		{ label: t("rooms.detail.stats.students"), value: studentsCount, badgeVariant: "circle" as const },
		{ label: t("rooms.detail.stats.signIn"), value: signedInCount, badgeVariant: "circle" as const },
		{
			label: t("rooms.detail.stats.ratio"),
			icon: (
				<Tooltip delay={0}>
					<Tooltip.Trigger
						className="inline-flex"
						aria-label={t(isGoodRatio ? "rooms.detail.ratioMetAria" : "rooms.detail.ratioNotMetAria")}
					>
						<span className="inline-flex cursor-default items-center justify-center">
							{isGoodRatio ? (
								<PhSmileyDuotone className="size-5 text-success" />
							) : (
								<PhSmileySadDuotone className="size-5 text-danger" />
							)}
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{t(isGoodRatio ? "rooms.detail.ratioMet" : "rooms.detail.ratioNotMet", { ratio: ratioValue })}
					</Tooltip.Content>
				</Tooltip>
			),
		},
	]

	const staffMembers = room?.signedInStaff ?? []
	const ageRange =
		room?.minAge != null && room?.maxAge != null
			? t("rooms.age.range", {
					max: formatAgeLabel(room.maxAge),
					min: formatAgeLabel(room.minAge),
				})
			: null

	return (
		<div>
			<div className="container mx-auto max-w-4xl">
				<div className="mb-8 flex">
					<div className="me-7">
						<Avatar className="size-37.5 bg-[#1D6FE8] text-white">
							<Avatar.Image
								src={room?.logo ? getMediaUrl(room.logo) : undefined}
								alt={room?.name ?? t("rooms.detail.fallbackRoom")}
								className="object-cover"
							/>
							<Avatar.Fallback className="text-white">
								<FluentConferenceRoom20Regular className="size-25 text-black" />
							</Avatar.Fallback>
						</Avatar>
					</div>
					<div className="w-full">
						<h1 className="mb-2 font-semibold leading-none lg:text-4xl">
							{room?.name ?? t("rooms.detail.fallbackRoom")}
						</h1>
						{ageRange && (
							<p className="flex items-center gap-2 text-sm">
								<span className="text-default-500">{t("rooms.detail.ageRange")}</span>
								<span className="font-medium text-neutral-800">{ageRange}</span>
							</p>
						)}
						<div className="mt-3.5 mb-4 flex items-center">
							<div className="flex flex-wrap gap-4">
								{stats.map((stat) => (
									<LabeledNumberBadge
										badgeVariant={stat.badgeVariant}
										icon={stat.icon}
										key={stat.label}
										label={stat.label}
										value={stat.value}
									/>
								))}
							</div>
						</div>
						<div className="flex items-center gap-3.5">
							<span>{t("rooms.detail.staff")}</span>
							<div className="flex flex-wrap gap-3.5">
								{staffMembers.length > 0 ? (
									staffMembers.map((staff) => <IdentityChip fullName={staff.name} key={staff.id} />)
								) : (
									<span className="text-default-400 text-sm">{t("rooms.detail.noStaffAssigned")}</span>
								)}
							</div>
						</div>
					</div>
				</div>

				<Tabs onSelectionChange={(key) => onTabChange(key as TabType)} selectedKey={activeTab}>
					<Tabs.ListContainer>
						<Tabs.List
							aria-label={t("rooms.detail.tabsAriaLabel")}
							className="w-fit *:h-6 *:w-fit *:px-3 *:font-normal *:text-sm *:data-[selected=true]:text-accent-foreground"
						>
							<Tabs.Tab id="students">
								{t("rooms.detail.tabs.students")}
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
							<Tabs.Tab id="activity">
								{t("rooms.detail.tabs.activity")}
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
							<Tabs.Tab id="profile">
								{t("rooms.detail.tabs.profile")}
								<Tabs.Indicator className="bg-accent" />
							</Tabs.Tab>
						</Tabs.List>
					</Tabs.ListContainer>
					<Tabs.Panel id="students" className="hidden">
						{null}
					</Tabs.Panel>
					<Tabs.Panel id="activity" className="hidden">
						{null}
					</Tabs.Panel>
					<Tabs.Panel id="profile" className="hidden">
						{null}
					</Tabs.Panel>
				</Tabs>
			</div>
		</div>
	)
}

export default RoomDetailHeader
