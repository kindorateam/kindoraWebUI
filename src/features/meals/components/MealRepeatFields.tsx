import { Input, Label, Switch, TextField } from "@heroui/react"
import { useTranslation } from "react-i18next"

import type { MealRepeatFrequency } from "../types"

type SwitchChangeValue = boolean | { target: { checked: boolean } }

interface MealRepeatFieldsProps {
	repeatFrequency: MealRepeatFrequency
	repeatUntil: string
	onRepeatFrequencyChange: (repeatFrequency: MealRepeatFrequency) => void
	onRepeatUntilChange: (repeatUntil: string) => void
}

const getSwitchSelection = (value: SwitchChangeValue) => {
	return typeof value === "boolean" ? value : value.target.checked
}

const MealRepeatFields = ({
	repeatFrequency,
	repeatUntil,
	onRepeatFrequencyChange,
	onRepeatUntilChange,
}: MealRepeatFieldsProps) => {
	const { t } = useTranslation()
	const repeatsWeekly = repeatFrequency === "weekly"

	return (
		<div className="grid gap-3">
			<Switch
				size="sm"
				isSelected={repeatsWeekly}
				onChange={(value) => onRepeatFrequencyChange(getSwitchSelection(value) ? "weekly" : "none")}
			>
				<Switch.Control>
					<Switch.Thumb />
				</Switch.Control>
				<Switch.Content>
					<Label>{t("meals.repeat.weekly")}</Label>
				</Switch.Content>
			</Switch>

			{repeatsWeekly && (
				<TextField variant="secondary">
					<Label>{t("meals.fields.repeatUntil")}</Label>
					<Input
						type="date"
						value={repeatUntil}
						placeholder={t("meals.placeholders.noRepeatEnd")}
						onChange={(event) => onRepeatUntilChange(event.target.value)}
					/>
				</TextField>
			)}
		</div>
	)
}

export default MealRepeatFields
