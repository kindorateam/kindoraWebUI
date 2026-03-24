import { Button, ButtonGroup, Label, Switch, Tabs } from "@heroui/react"
import { useAtom } from "jotai"

import TablerChevronLeft from "~icons/tabler/chevron-left"
import TablerChevronRight from "~icons/tabler/chevron-right"
import TablerPlus from "~icons/tabler/plus"

import { CALENDAR_VIEW_OPTIONS } from "../constants"
import { calendarViewAtom, hideWeekendsAtom } from "../stores/calendarSettings.store"
import { openCreateEventModal } from "../stores/eventModal.store"

import type { CalendarViewType } from "../types"

interface Props {
	title: string
	onNavigatePrev: () => void
	onNavigateNext: () => void
	onNavigateToday: () => void
}

const CalendarToolbar = ({ title, onNavigatePrev, onNavigateNext, onNavigateToday }: Props) => {
	const [currentView, setCurrentView] = useAtom(calendarViewAtom)
	const [hideWeekends, setHideWeekends] = useAtom(hideWeekendsAtom)

	return (
		<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<ButtonGroup size="sm" variant="flat">
					<Button isIconOnly onPress={onNavigatePrev}>
						<TablerChevronLeft className="size-[18px]" />
					</Button>
					<Button isIconOnly onPress={onNavigateNext}>
						<TablerChevronRight className="size-[18px]" />
					</Button>
				</ButtonGroup>
				<Button size="sm" variant="flat" onPress={onNavigateToday}>
					Today
				</Button>
				<h2 className="ml-2 font-semibold text-xl">{title}</h2>
			</div>

			<div className="flex items-center gap-4">
				<Switch size="sm" isSelected={hideWeekends} onChange={(e) => setHideWeekends(e.target.checked)}>
					<Switch.Control>
						<Switch.Thumb />
					</Switch.Control>
					<Switch.Content>
						<Label>Hide weekends</Label>
					</Switch.Content>
				</Switch>

				<Tabs size="sm" selectedKey={currentView} onSelectionChange={(key) => setCurrentView(key as CalendarViewType)}>
					<Tabs.ListContainer>
						<Tabs.List aria-label="Calendar view">
							{CALENDAR_VIEW_OPTIONS.map((opt) => (
								<Tabs.Tab key={opt.key} id={opt.key}>
									{opt.label}
									<Tabs.Indicator />
								</Tabs.Tab>
							))}
						</Tabs.List>
					</Tabs.ListContainer>
					{CALENDAR_VIEW_OPTIONS.map((opt) => (
						<Tabs.Panel key={opt.key} id={opt.key} />
					))}
				</Tabs>

				<Button
					color="primary"
					size="sm"
					startContent={<TablerPlus className="size-4" />}
					onPress={() => openCreateEventModal()}
				>
					Add Event
				</Button>
			</div>
		</div>
	)
}

export default CalendarToolbar
