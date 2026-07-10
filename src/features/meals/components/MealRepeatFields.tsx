import { FieldError, Input, Label, ListBox, Select, TextField, ToggleButton, ToggleButtonGroup } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { MEAL_REPEAT_OPTIONS } from "../constants"

import type { MealRepeatDay, MealRepeatFrequency } from "../types"

type SelectionKey = string | number

interface MealRepeatFieldsProps {
	date: string
	repeatFrequency: MealRepeatFrequency
	repeatDays: MealRepeatDay[]
	repeatUntil: string
	onRepeatFrequencyChange: (repeatFrequency: MealRepeatFrequency) => void
	onRepeatDaysChange: (repeatDays: MealRepeatDay[]) => void
	onRepeatUntilChange: (repeatUntil: string) => void
}

const DAY_VALUES: MealRepeatDay[] = [0, 1, 2, 3, 4, 5, 6]

const getDayLabel = (day: MealRepeatDay, locale: string, length: "long" | "short") => {
	const date = new Date(2026, 0, 4 + day)
	return date.toLocaleDateString(locale, { weekday: length })
}

const MealRepeatFields = ({
	date,
	repeatFrequency,
	repeatDays,
	repeatUntil,
	onRepeatFrequencyChange,
	onRepeatDaysChange,
	onRepeatUntilChange,
}: MealRepeatFieldsProps) => {
	const { t, i18n } = useTranslation()
	const selectedDate = new Date(`${date}T12:00:00`)
	const weeklyDay = selectedDate.toLocaleDateString(i18n.language, { weekday: "long" })
	const isRepeating = repeatFrequency !== "none"
	const needsCustomDays = repeatFrequency === "custom"

	const getRepeatOptionLabel = (frequency: MealRepeatFrequency) => {
		if (frequency === "weekly") return t("meals.repeat.weeklyOn", { day: weeklyDay })
		const option = MEAL_REPEAT_OPTIONS.find((candidate) => candidate.key === frequency)
		return option ? t(option.labelKey) : t("meals.repeat.none")
	}

	const handleDaySelectionChange = (keys: Set<SelectionKey>) => {
		onRepeatDaysChange(
			[...keys]
				.map(Number)
				.filter((day): day is MealRepeatDay => DAY_VALUES.includes(day as MealRepeatDay))
				.sort((left, right) => left - right),
		)
	}

	return (
		<div className="grid gap-4">
			<Select
				selectedKey={repeatFrequency}
				variant="secondary"
				onSelectionChange={(key) => {
					if (key !== null) onRepeatFrequencyChange(key as MealRepeatFrequency)
				}}
			>
				<Label>{t("meals.fields.repeat")}</Label>
				<Select.Trigger>
					<Select.Value />
					<Select.Indicator />
				</Select.Trigger>
				<Select.Popover>
					<ListBox>
						{MEAL_REPEAT_OPTIONS.map((option) => (
							<ListBox.Item id={option.key} key={option.key} textValue={getRepeatOptionLabel(option.key)}>
								{getRepeatOptionLabel(option.key)}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>
			</Select>

			{needsCustomDays && (
				<div className="grid gap-2">
					<Label className="font-medium text-foreground text-sm">{t("meals.repeat.chooseDays")}</Label>
					<ToggleButtonGroup
						aria-label={t("meals.repeat.chooseDays")}
						className="grid grid-cols-7 gap-1.5"
						isDetached
						onSelectionChange={handleDaySelectionChange}
						selectedKeys={new Set<SelectionKey>(repeatDays.map(String))}
						selectionMode="multiple"
					>
						{DAY_VALUES.map((day) => (
							<ToggleButton
								aria-label={getDayLabel(day, i18n.language, "long")}
								className="min-w-0 px-1 data-[selected=true]:bg-primary data-[selected=true]:text-white"
								id={String(day)}
								key={day}
								size="sm"
								variant="default"
							>
								{getDayLabel(day, i18n.language, "short")}
							</ToggleButton>
						))}
					</ToggleButtonGroup>
					{repeatDays.length === 0 && <FieldError>{t("meals.repeat.chooseDayError")}</FieldError>}
				</div>
			)}

			{isRepeating && (
				<div>
					<TextField variant="secondary">
						<Label>{t("meals.fields.repeatUntil")}</Label>
						<Input type="date" value={repeatUntil} onChange={(event) => onRepeatUntilChange(event.target.value)} />
					</TextField>
					<p className="mt-1.5 text-default-500 text-xs leading-5">{t("meals.repeat.noEndDate")}</p>
				</div>
			)}
		</div>
	)
}

export default MealRepeatFields
