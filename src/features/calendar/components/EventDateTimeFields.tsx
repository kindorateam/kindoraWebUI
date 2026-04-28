import { Input, Label, TextField } from "@heroui/react"

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
	return (
		<>
			<TextField isRequired variant="secondary">
				<Label>Start date</Label>
				<Input
					type="date"
					value={startDate}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("startDate", e.target.value)}
				/>
			</TextField>
			{!allDay && (
				<TextField variant="secondary">
					<Label>Start time</Label>
					<Input
						type="time"
						value={startTime}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("startTime", e.target.value)}
					/>
				</TextField>
			)}
			{!endsSameDay && (
				<TextField isRequired variant="secondary">
					<Label>End date</Label>
					<Input
						type="date"
						value={endDate}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("endDate", e.target.value)}
					/>
				</TextField>
			)}
			{!allDay && (
				<TextField variant="secondary">
					<Label>End time</Label>
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
