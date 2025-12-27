import { Input } from "@heroui/react"

interface ProfileFieldProps {
	label: string
	value: string | number | null | undefined
	endContent?: React.ReactNode
	isEditing?: boolean
	onChange?: (value: string) => void
}

export default function ProfileField({ label, value, endContent, isEditing = false, onChange }: ProfileFieldProps) {
	if (isEditing) {
		return (
			<Input
				className="flex-1"
				classNames={{
					inputWrapper: "min-h-[32px] rounded-xl bg-default-100 px-3 py-1 shadow-sm",
					label: "text-default-500 text-xs",
					input: "text-foreground text-sm",
				}}
				endContent={endContent}
				label={label}
				labelPlacement="inside"
				placeholder=" "
				size="sm"
				value={String(value ?? "")}
				variant="flat"
				onValueChange={onChange}
			/>
		)
	}

	const displayValue = value === null || value === undefined || value === "" ? "—" : value

	return (
		<div className="flex min-h-[32px] flex-1 items-center justify-between gap-2 rounded-xl bg-default-100 px-3 py-1 shadow-sm">
			<div className="flex flex-1 flex-col justify-center">
				<span className="text-default-500 text-xs">{label}</span>
				<span className="text-foreground text-sm">{displayValue}</span>
			</div>
			{endContent && <span className="text-default-500">{endContent}</span>}
		</div>
	)
}
