import { Input } from "@heroui/react"

interface ProfileFieldProps {
	label: string
	value: string | number | null | undefined
	isEditing?: boolean
	onChange?: (value: string) => void
}

export default function ProfileField({ label, value, isEditing = false, onChange }: ProfileFieldProps) {
	if (isEditing) {
		return (
			<Input
				className="flex-1"
				label={label}
				labelPlacement="outside"
				placeholder={label}
				size="sm"
				value={String(value ?? "")}
				variant="flat"
				onValueChange={onChange}
			/>
		)
	}

	return (
		<div className="flex min-h-[46px] flex-1 flex-col justify-center rounded-xl bg-default-100 px-3 py-2 shadow-sm">
			<span className="text-default-500 text-xs">{label}</span>
			<span className="text-foreground text-sm">{value || "—"}</span>
		</div>
	)
}
