import { Button, FieldError, Label, ListBox, Select, Spinner, Tabs } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { useInfiniteRooms } from "@/features/rooms/hooks/useRooms"

import type { MealAudience } from "../utils/mealForm"

interface MealAudienceFieldsProps {
	audience: MealAudience
	roomIds: string[]
	onAudienceChange: (audience: MealAudience) => void
	onRoomIdsChange: (roomIds: string[]) => void
}

const MealAudienceFields = ({ audience, roomIds, onAudienceChange, onRoomIdsChange }: MealAudienceFieldsProps) => {
	const { t } = useTranslation()
	const { rooms, isLoading, isError, refetch } = useInfiniteRooms("active", audience === "selected")
	const hasSelectedRooms = roomIds.length > 0

	return (
		<div className="grid gap-3">
			<div>
				<Label className="font-medium text-foreground text-sm">{t("meals.audience.title")}</Label>
				<Tabs
					className="mt-1"
					selectedKey={audience}
					variant="secondary"
					onSelectionChange={(key) => {
						if (key === "all" || key === "selected") onAudienceChange(key)
					}}
				>
					<Tabs.ListContainer className="w-full">
						<Tabs.List aria-label={t("meals.audience.title")} className="w-full border-b-0!">
							<Tabs.Tab id="all">
								{t("meals.audience.all")}
								<Tabs.Indicator />
							</Tabs.Tab>
							<Tabs.Tab id="selected">
								{t("meals.audience.selected")}
								<Tabs.Indicator />
							</Tabs.Tab>
						</Tabs.List>
					</Tabs.ListContainer>
					<Tabs.Panel className="hidden" id="all">
						{null}
					</Tabs.Panel>
					<Tabs.Panel className="hidden" id="selected">
						{null}
					</Tabs.Panel>
				</Tabs>
			</div>

			{audience === "all" ? (
				<p className="text-default-500 text-xs leading-5">{t("meals.audience.allDescription")}</p>
			) : isError ? (
				<div className="flex items-center justify-between gap-3 rounded-xl bg-danger-50 px-3 py-2 text-danger-700 text-sm">
					<span>{t("meals.audience.loadError")}</span>
					<Button size="sm" variant="ghost" onPress={() => void refetch()}>
						{t("tableError.retry")}
					</Button>
				</div>
			) : (
				<Select
					isDisabled={isLoading}
					isInvalid={!hasSelectedRooms && !isLoading}
					selectionMode="multiple"
					value={roomIds}
					variant="secondary"
					onChange={(keys) => {
						const selectedIds = Array.isArray(keys) ? keys.map(String) : keys ? [String(keys)] : []
						onRoomIdsChange(selectedIds)
					}}
				>
					<Label>{t("meals.audience.selectRooms")}</Label>
					<Select.Trigger>
						<Select.Value />
						{isLoading ? <Spinner size="sm" /> : <Select.Indicator />}
					</Select.Trigger>
					<Select.Popover>
						<ListBox>
							{rooms.map((room) => (
								<ListBox.Item id={room.id} key={room.id} textValue={room.name}>
									{room.name}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
					{!hasSelectedRooms && !isLoading && <FieldError>{t("meals.audience.selectedRequired")}</FieldError>}
				</Select>
			)}
		</div>
	)
}

export default MealAudienceFields
