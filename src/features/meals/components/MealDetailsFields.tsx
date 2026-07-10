import { Input, Label, ListBox, Select, TextField } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { MEAL_TYPE_OPTIONS } from "../constants"

import MealTagField from "./MealTagField"

import type { MealType } from "../types"
import type { MealPlanFormState } from "../utils/mealForm"

interface MealDetailsFieldsProps {
	formData: MealPlanFormState
	onFieldChange: <K extends keyof MealPlanFormState>(field: K, value: MealPlanFormState[K]) => void
	onMealTypeChange: (mealType: MealType) => void
}

const MealDetailsFields = ({ formData, onFieldChange, onMealTypeChange }: MealDetailsFieldsProps) => {
	const { t } = useTranslation()

	return (
		<>
			<div className="grid gap-4">
				<TextField isRequired variant="secondary">
					<Label>{t("meals.fields.date")}</Label>
					<Input type="date" value={formData.date} onChange={(event) => onFieldChange("date", event.target.value)} />
				</TextField>
				<TextField isRequired variant="secondary">
					<Label>{t("meals.fields.servedTime")}</Label>
					<Input
						type="time"
						value={formData.servedTime}
						onChange={(event) => onFieldChange("servedTime", event.target.value)}
					/>
				</TextField>
			</div>

			<Select
				selectedKey={formData.mealType}
				variant="secondary"
				onSelectionChange={(key) => {
					if (key !== null) onMealTypeChange(key as MealType)
				}}
			>
				<Label>{t("meals.fields.type")}</Label>
				<Select.Trigger>
					<Select.Value />
					<Select.Indicator />
				</Select.Trigger>
				<Select.Popover>
					<ListBox>
						{MEAL_TYPE_OPTIONS.map((option) => (
							<ListBox.Item id={option.key} key={option.key} textValue={t(option.labelKey)}>
								{t(option.labelKey)}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>
			</Select>

			<div>
				<TextField isRequired variant="secondary">
					<Label>{t("meals.fields.title")}</Label>
					<Input
						placeholder={t("meals.placeholders.title")}
						value={formData.title}
						onChange={(event) => onFieldChange("title", event.target.value)}
					/>
				</TextField>
				<p className="mt-1.5 text-default-500 text-xs leading-5">{t("meals.helpers.title")}</p>
			</div>

			<MealTagField
				helperText={t("meals.helpers.items")}
				id="meal-items"
				isRequired
				label={t("meals.fields.items")}
				placeholder={t("meals.placeholders.items")}
				values={formData.items}
				onChange={(items) => onFieldChange("items", items)}
			/>
		</>
	)
}

export default MealDetailsFields
