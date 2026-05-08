import { Label, ListBox, Select } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { EVENT_COLOR_OPTIONS } from "../constants"

interface EventColorSelectProps {
	value: string
	onChange: (value: string) => void
}

const EventColorSelect = ({ value, onChange }: EventColorSelectProps) => {
	const { t } = useTranslation()
	const selectedOption = EVENT_COLOR_OPTIONS.find((opt) => opt.key === value)

	return (
		<Select
			selectedKey={value}
			variant="secondary"
			onSelectionChange={(key) => {
				if (key !== null) onChange(String(key))
			}}
		>
			<Label>{t("calendar.fields.color")}</Label>
			<Select.Trigger>
				<Select.Value>
					{({ isPlaceholder, defaultChildren }) => {
						if (isPlaceholder || !selectedOption) return defaultChildren

						return (
							<span className="flex items-center gap-2">
								<span
									aria-hidden="true"
									className="size-3 rounded-full"
									style={{ backgroundColor: selectedOption.key }}
								/>
								{t(selectedOption.labelKey)}
							</span>
						)
					}}
				</Select.Value>
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox>
					{EVENT_COLOR_OPTIONS.map((opt) => (
						<ListBox.Item id={opt.key} key={opt.key} textValue={t(opt.labelKey)}>
							<span className="flex items-center gap-2">
								<span aria-hidden="true" className="size-3 rounded-full" style={{ backgroundColor: opt.key }} />
								{t(opt.labelKey)}
							</span>
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	)
}

export default EventColorSelect
