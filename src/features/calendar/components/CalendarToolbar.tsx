import { Button, ButtonGroup, Label, Switch, Tabs } from "@heroui/react"
import { useAtom } from "jotai"
import { useTranslation } from "react-i18next"

import OcticonFeedPlus16 from "~icons/octicon/feed-plus-16"
import TablerChevronLeft from "~icons/tabler/chevron-left"
import TablerChevronRight from "~icons/tabler/chevron-right"

import { CALENDAR_VIEW_OPTIONS } from "../constants"
import { calendarViewAtom } from "../stores/calendarSettings.store"
import { openCreateEventModal } from "../stores/eventModal.store"

import type { CalendarViewType } from "../types"

type SwitchChangeValue = boolean | { target: { checked: boolean } }

const getSwitchSelection = (value: SwitchChangeValue) => {
	return typeof value === "boolean" ? value : value.target.checked
}

interface Props {
	title: string
	onNavigatePrev: () => void
	onNavigateNext: () => void
	onNavigateToday: () => void
	hideWeekends: boolean
	onHideWeekendsChange: (isSelected: boolean) => void
	showMeals: boolean
	onShowMealsChange: (isSelected: boolean) => void
}

const CalendarToolbar = ({
	title,
	onNavigatePrev,
	onNavigateNext,
	onNavigateToday,
	hideWeekends,
	onHideWeekendsChange,
	showMeals,
	onShowMealsChange,
}: Props) => {
	const { t } = useTranslation()
	const [currentView, setCurrentView] = useAtom(calendarViewAtom)

	return (
		<div className="flex flex-col gap-4 border-default-200 border-b bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
			<div className="flex flex-wrap items-center gap-3">
				<ButtonGroup size="sm" variant="outline">
					<Button aria-label={t("calendar.toolbar.previous")} isIconOnly onPress={onNavigatePrev}>
						<TablerChevronLeft className="size-4.5" />
					</Button>
					<Button onPress={onNavigateToday}>{t("calendar.toolbar.today")}</Button>
					<Button aria-label={t("calendar.toolbar.next")} isIconOnly onPress={onNavigateNext}>
						<TablerChevronRight className="size-4.5" />
					</Button>
				</ButtonGroup>
				<h2 className="font-semibold text-foreground text-xl">{title}</h2>
			</div>

			<div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
				<Switch
					size="sm"
					isSelected={hideWeekends}
					onChange={(value) => onHideWeekendsChange(getSwitchSelection(value))}
				>
					<Switch.Control>
						<Switch.Thumb />
					</Switch.Control>
					<Switch.Content>
						<Label className="text-default-600">{t("calendar.toolbar.hideWeekends")}</Label>
					</Switch.Content>
				</Switch>

				<Switch size="sm" isSelected={showMeals} onChange={(value) => onShowMealsChange(getSwitchSelection(value))}>
					<Switch.Control>
						<Switch.Thumb />
					</Switch.Control>
					<Switch.Content>
						<Label className="text-default-600">{t("calendar.toolbar.showMeals")}</Label>
					</Switch.Content>
				</Switch>

				<Tabs
					className="shrink-0"
					selectedKey={currentView}
					onSelectionChange={(key) => setCurrentView(key as CalendarViewType)}
				>
					<Tabs.ListContainer>
						<Tabs.List
							aria-label={t("calendar.toolbar.viewAria")}
							className="w-fit *:h-6 *:w-fit *:px-3 *:font-normal *:text-sm *:data-[selected=true]:text-accent-foreground"
						>
							{CALENDAR_VIEW_OPTIONS.map((opt) => (
								<Tabs.Tab key={opt.key} id={opt.key}>
									{t(opt.labelKey)}
									<Tabs.Indicator className="bg-accent" />
								</Tabs.Tab>
							))}
						</Tabs.List>
					</Tabs.ListContainer>
					{CALENDAR_VIEW_OPTIONS.map((opt) => (
						<Tabs.Panel key={opt.key} id={opt.key} className="hidden">
							{null}
						</Tabs.Panel>
					))}
				</Tabs>

				<Button className="shrink-0" variant="primary" size="sm" onPress={() => openCreateEventModal()}>
					<OcticonFeedPlus16 aria-hidden className="size-4" />
					{t("calendar.toolbar.addEvent")}
				</Button>
			</div>
		</div>
	)
}

export default CalendarToolbar
