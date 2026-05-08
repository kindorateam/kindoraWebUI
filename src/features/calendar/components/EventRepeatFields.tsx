import { Label, ListBox, Select } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { EVENT_REPEAT_OPTIONS } from "../constants"

import type { EventRepeatFrequency } from "../types"

interface EventRepeatFieldsProps {
	frequency: EventRepeatFrequency
	onFrequencyChange: (frequency: EventRepeatFrequency) => void
}

const EventRepeatFields = ({ frequency, onFrequencyChange }: EventRepeatFieldsProps) => {
	const { t } = useTranslation()

	return (
		<Select
			selectedKey={frequency}
			variant="secondary"
			onSelectionChange={(key) => {
				if (key !== null) onFrequencyChange(key as EventRepeatFrequency)
			}}
		>
			<Label>{t("calendar.fields.repeat")}</Label>
			<Select.Trigger>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox>
					{EVENT_REPEAT_OPTIONS.map((option) => (
						<ListBox.Item id={option.key} key={option.key} textValue={t(option.labelKey)}>
							{t(option.labelKey)}
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	)
}

export default EventRepeatFields
