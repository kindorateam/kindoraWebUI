import { Select, SelectItem } from "@heroui/react"

import type { MessagesSelectOption } from "../types"

interface FilterSelectProps {
	label: string
	options: MessagesSelectOption[]
	selectedKey: string
	onChange: (value: string) => void
}

export default function FilterSelect({ label, onChange, options, selectedKey }: FilterSelectProps) {
	return (
		<Select
			aria-label={label}
			className="w-full"
			classNames={{
				base: "w-full",
				label: "pb-1 text-xs font-medium text-default-500",
				trigger: "h-11 rounded-xl bg-default-100 px-3 shadow-none",
				value: "text-sm font-medium text-foreground",
			}}
			disallowEmptySelection
			label={label}
			labelPlacement="outside"
			onSelectionChange={(keys) => {
				const selected = Array.from(keys)[0]
				if (selected !== undefined) {
					onChange(String(selected))
				}
			}}
			radius="lg"
			selectedKeys={[selectedKey]}
			variant="flat"
		>
			{options.map((option) => (
				<SelectItem key={option.key}>{option.label}</SelectItem>
			))}
		</Select>
	)
}
