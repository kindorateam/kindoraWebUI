import { Calendar, DateField, DatePicker, Label } from "@heroui/react"

import type { DateValue } from "@internationalized/date"

interface DatePickerFieldProps {
	className?: string
	label: string
	onChange: (value: DateValue | null) => void
	showYearPicker?: boolean
	value: DateValue | null
}

const DatePickerField = ({ className, label, onChange, showYearPicker = false, value }: DatePickerFieldProps) => (
	<DatePicker className={className} granularity="day" onChange={onChange} value={value}>
		<Label>{label}</Label>
		<DateField.Group fullWidth variant="secondary">
			<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
			<DateField.Suffix>
				<DatePicker.Trigger>
					<DatePicker.TriggerIndicator />
				</DatePicker.Trigger>
			</DateField.Suffix>
		</DateField.Group>
		<DatePicker.Popover>
			<Calendar aria-label={label}>
				<Calendar.Header>
					{showYearPicker && (
						<Calendar.YearPickerTrigger>
							<Calendar.YearPickerTriggerHeading />
							<Calendar.YearPickerTriggerIndicator />
						</Calendar.YearPickerTrigger>
					)}
					<Calendar.NavButton slot="previous" />
					{!showYearPicker && <Calendar.Heading />}
					<Calendar.NavButton slot="next" />
				</Calendar.Header>
				<Calendar.Grid>
					<Calendar.GridHeader>{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
					<Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
				</Calendar.Grid>
				{showYearPicker && (
					<Calendar.YearPickerGrid>
						<Calendar.YearPickerGridBody>
							{({ year }) => <Calendar.YearPickerCell year={year} />}
						</Calendar.YearPickerGridBody>
					</Calendar.YearPickerGrid>
				)}
			</Calendar>
		</DatePicker.Popover>
	</DatePicker>
)

export default DatePickerField
