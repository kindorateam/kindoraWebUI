import { Input, Label, TextField } from "@heroui/react"

interface EventDateTimeFieldsProps {
	startDate: string
	startTime: string
	endDate: string
	endTime: string
	allDay: boolean
	onFieldChange: (field: "startDate" | "startTime" | "endDate" | "endTime", value: string) => void
}

const EventDateTimeFields = ({
	startDate,
	startTime,
	endDate,
	endTime,
	allDay,
	onFieldChange,
}: EventDateTimeFieldsProps) => {
	return (
		<>
			<div className="grid grid-cols-2 gap-3">
				<TextField isRequired>
					<Label>Start date</Label>
					<Input
						type="date"
						value={startDate}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("startDate", e.target.value)}
					/>
				</TextField>
				{!allDay && (
					<TextField>
						<Label>Start time</Label>
						<Input
							type="time"
							value={startTime}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("startTime", e.target.value)}
						/>
					</TextField>
				)}
			</div>

			<div className="grid grid-cols-2 gap-3">
				<TextField isRequired>
					<Label>End date</Label>
					<Input
						type="date"
						value={endDate}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("endDate", e.target.value)}
					/>
				</TextField>
				{!allDay && (
					<TextField>
						<Label>End time</Label>
						<Input
							type="time"
							value={endTime}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange("endTime", e.target.value)}
						/>
					</TextField>
				)}
			</div>
		</>
	)
}

export default EventDateTimeFields
