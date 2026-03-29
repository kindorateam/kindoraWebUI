import { Label, ListBox, Select } from "@heroui/react"

import { EVENT_COLOR_OPTIONS } from "../constants"

interface EventColorSelectProps {
	value: string
	onChange: (value: string) => void
}

const EventColorSelect = ({ value, onChange }: EventColorSelectProps) => {
	return (
		<Select
			selectedKey={value}
			onSelectionChange={(key) => {
				if (key !== null) onChange(String(key))
			}}
		>
			<Label>Color</Label>
			<Select.Trigger>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox>
					{EVENT_COLOR_OPTIONS.map((opt) => (
						<ListBox.Item id={opt.key} key={opt.key} textValue={opt.label}>
							<div className="size-3 rounded-full" style={{ backgroundColor: opt.key }} />
							{opt.label}
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	)
}

export default EventColorSelect
