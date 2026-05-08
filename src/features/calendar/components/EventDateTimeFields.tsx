import { Input, Label, TextField } from "@heroui/react"
import { useTranslation } from "react-i18next"

interface EventDateTimeFieldsProps {
	startDate: string
	startTime: string
	endDate: string
	endTime: string
	allDay: boolean
	endsSameDay: boolean
	onFieldChange: (field: "startDate" | "startTime" | "endDate" | "endTime", value: string) => void
}

const EventDateTimeFields = ({
	startDate,
	startTime,
	endDate,
	endTime,
	allDay,
	endsSameDay,
	onFieldChange,
}: EventDateTimeFieldsProps) => {
	const { t } = useTranslation()

	return (
		<>
			<TextField isRequired variant="secondary">
				<Label>{t("calendar.fields.startDate")}</Label>
				<Input
					type="date"
					value={startDate}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("startDate", e.target.value)}
				/>
			</TextField>
			{!allDay && (
				<TextField variant="secondary">
					<Label>{t("calendar.fields.startTime")}</Label>
					<Input
						type="time"
						value={startTime}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("startTime", e.target.value)}
					/>
				</TextField>
			)}
			{!endsSameDay && (
				<TextField isRequired variant="secondary">
					<Label>{t("calendar.fields.endDate")}</Label>
					<Input
						type="date"
						value={endDate}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("endDate", e.target.value)}
					/>
				</TextField>
			)}
			{!allDay && (
				<TextField variant="secondary">
					<Label>{t("calendar.fields.endTime")}</Label>
					<Input
						type="time"
						value={endTime}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("endTime", e.target.value)}
					/>
				</TextField>
			)}
		</>
	)
}

export default EventDateTimeFields
