import { Avatar, Badge, Button, Chip, Separator, Tabs } from "@heroui/react"
import { useTranslation } from "react-i18next"

import IdentityChip from "@/components/IdentityChip"
import FluentPerson16Filled from "~icons/fluent/person-16-filled"
import SolarCalendarBroken from "~icons/solar/calendar-broken"

import type { Student } from "../../types"

type TabType = "activity" | "profile" | "documents" | "immunization" | "billing"

interface StudentDetailHeaderProps {
	student: Student
	activeTab: TabType
	onTabChange: (tab: TabType) => void
	onMoveToRoom?: () => void
	onScheduleAbsence?: () => void
}

const formatAbsenceDate = (student: Student, locale: string) => {
	if (!student.absence) return null
	const dateFormatter = new Intl.DateTimeFormat(locale, {
		month: "short",
		day: "numeric",
	})

	return `${dateFormatter.format(new Date(student.absence.dateFrom))} - ${dateFormatter.format(new Date(student.absence.dateTo))}`
}

const StudentDetailHeader = ({
	student,
	activeTab,
	onTabChange,
	onMoveToRoom,
	onScheduleAbsence,
}: StudentDetailHeaderProps) => {
	const { i18n, t } = useTranslation()
	const studentName = `${student.firstName} ${student.lastName}`
	const absenceDate = formatAbsenceDate(student, i18n.language)

	return (
		<div className="container mx-auto max-w-4xl">
			<div className="mb-8 flex items-start gap-10">
				<Badge.Anchor>
					<Avatar className="size-25 shrink-0 border-4 border-white shadow-md">
						<Avatar.Image src={student.avatar?.path} alt={studentName} />
						<Avatar.Fallback className="bg-accent text-white">
							<FluentPerson16Filled className="size-22 text-white" />
						</Avatar.Fallback>
					</Avatar>
					<Badge color={student.checkedIn ? "success" : "danger"} placement="bottom-right" />
				</Badge.Anchor>

				<div className="flex min-w-0 flex-1 flex-col gap-6 pt-1">
					<div className="flex flex-col gap-2">
						<h1 className="font-semibold text-4xl leading-none">{studentName}</h1>
						<Separator />
					</div>

					<div className="flex items-center gap-6">
						<div className="flex items-center gap-4">
							<span className="text-neutral-600 text-sm">{t("students.detail.header.rooms")}</span>
							<IdentityChip
								fallbackIcon="room"
								fullName={student.room?.title ?? t("students.detail.header.unassigned")}
							/>
						</div>

						<Button
							className="ml-auto shadow-sm"
							isDisabled={!onMoveToRoom}
							onPress={onMoveToRoom}
							size="md"
							variant="outline"
						>
							{t("students.detail.header.moveToRoom")}
						</Button>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-neutral-600 text-sm">{t("students.detail.header.scheduleAbsence")}</span>
						<Button variant="primary" isDisabled={!onScheduleAbsence} isIconOnly onPress={onScheduleAbsence} size="sm">
							<SolarCalendarBroken className="size-4 text-white" />
						</Button>

						<div className="flex items-center gap-3">
							<span className="text-neutral-600 text-sm">{t("students.detail.header.absenceDate")}</span>
							<Chip className="bg-secondary-100/80" size="sm">
								<span className="text-secondary-600 text-sm">
									{absenceDate ?? t("students.detail.header.notScheduled")}
								</span>
							</Chip>
						</div>
					</div>
				</div>
			</div>

			<Tabs onSelectionChange={(key) => onTabChange(key as TabType)} selectedKey={activeTab}>
				<Tabs.ListContainer>
					<Tabs.List
						aria-label={t("students.detail.header.tabsAriaLabel")}
						className="w-fit *:h-6 *:w-fit *:px-3 *:font-normal *:text-sm *:data-[selected=true]:text-accent-foreground"
					>
						<Tabs.Tab id="activity">
							{t("students.detail.header.tabs.activity")}
							<Tabs.Indicator className="bg-accent" />
						</Tabs.Tab>
						<Tabs.Tab id="profile">
							{t("students.detail.header.tabs.profile")}
							<Tabs.Indicator className="bg-accent" />
						</Tabs.Tab>
						<Tabs.Tab id="documents">
							{t("students.detail.header.tabs.documents")}
							<Tabs.Indicator className="bg-accent" />
						</Tabs.Tab>
						<Tabs.Tab id="immunization">
							{t("students.detail.header.tabs.immunization")}
							<Tabs.Indicator className="bg-accent" />
						</Tabs.Tab>
						<Tabs.Tab id="billing">
							{t("students.detail.header.tabs.billing")}
							<Tabs.Indicator className="bg-accent" />
						</Tabs.Tab>
					</Tabs.List>
				</Tabs.ListContainer>
				<Tabs.Panel id="activity" className="hidden">
					{null}
				</Tabs.Panel>
				<Tabs.Panel id="profile" className="hidden">
					{null}
				</Tabs.Panel>
				<Tabs.Panel id="documents" className="hidden">
					{null}
				</Tabs.Panel>
				<Tabs.Panel id="immunization" className="hidden">
					{null}
				</Tabs.Panel>
				<Tabs.Panel id="billing" className="hidden">
					{null}
				</Tabs.Panel>
			</Tabs>
		</div>
	)
}

export default StudentDetailHeader
