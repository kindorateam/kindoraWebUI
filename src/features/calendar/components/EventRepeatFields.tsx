import { Label, ListBox, Select } from "@heroui/react"

import type { EventRepeatFrequency } from "../types"

const REPEAT_OPTIONS: { key: EventRepeatFrequency; label: string }[] = [
	{ key: "none", label: "Does not repeat" },
	{ key: "daily", label: "Daily" },
	{ key: "weekly", label: "Weekly" },
	{ key: "monthly", label: "Monthly" },
	{ key: "yearly", label: "Yearly" },
]

interface EventRepeatFieldsProps {
	frequency: EventRepeatFrequency
	onFrequencyChange: (frequency: EventRepeatFrequency) => void
}

const EventRepeatFields = ({ frequency, onFrequencyChange }: EventRepeatFieldsProps) => {
	return (
		<Select
			selectedKey={frequency}
			variant="secondary"
			onSelectionChange={(key) => {
				if (key !== null) onFrequencyChange(key as EventRepeatFrequency)
			}}
		>
			<Label>Repeat</Label>
			<Select.Trigger>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox>
					{REPEAT_OPTIONS.map((option) => (
						<ListBox.Item id={option.key} key={option.key} textValue={option.label}>
							{option.label}
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	)
}

export default EventRepeatFields
