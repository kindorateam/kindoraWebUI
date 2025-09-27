import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"
import clsx from "clsx"

import type { FilterProps } from "@/types/TableFilters"

interface FiltersProps {
	filters: FilterProps[]
	onFilterChange: (filterId: string, value: string) => void
}

const Filters = ({ filters, onFilterChange }: FiltersProps) => {
	const getFilterDisplay = (filter: FilterProps) => {
		const isActive = isFilterActive(filter)

		const isDefault = !filter.value || filter.value === "all" || filter.value === "none" || filter.value === ""

		if (isDefault) {
			return (
				<>
					<span className="text-sm">{filter.label} </span>
					<span className="font-medium text-sm">None</span>
				</>
			)
		}

		const selectedOption = filter.options.find((opt) => opt.value === filter.value)
		return (
			<>
				<span className="text-sm">{filter.label} </span>
				<span className={clsx([`${isActive ? "text-brand" : ""}`, "font-medium text-sm"])}>
					{selectedOption?.label ?? filter.value}
				</span>
			</>
		)
	}

	// Helper function to determine if filter is active
	const isFilterActive = (filter: FilterProps) => {
		return filter.value && filter.value !== "all" && filter.value !== "none" && filter.value !== ""
	}

	return (
		<div className="flex flex-wrap gap-6">
			{filters.map((filter) => {
				return (
					<Dropdown key={filter.id}>
						<DropdownTrigger>
							<div className="cursor-pointer">{getFilterDisplay(filter)}</div>
						</DropdownTrigger>
						<DropdownMenu
							aria-label={`${filter.label} options`}
							onAction={(key) => onFilterChange(filter.id, key as string)}
							selectedKeys={[filter.value]}
							selectionMode="single"
						>
							{filter.options.map((option) => (
								<DropdownItem className={option.value === filter.value ? "bg-pink-50" : ""} key={option.value}>
									{option.label}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				)
			})}
		</div>
	)
}

export default Filters
