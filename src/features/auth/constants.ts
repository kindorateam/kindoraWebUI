export const CODE_EXPIRATION_SECONDS = 300
export const RESEND_COOLDOWN_SECONDS = 60

export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export type StrengthLabel = "weak" | "average" | "strong" | "superStrong"

export const passwordRequirements = [
	{
		id: "length",
		label: "At least 8 characters long",
		test: (value: string) => value.length >= 8,
		required: true,
	},
	{
		id: "lowercase",
		label: "One lowercase character",
		test: (value: string) => /[a-z]/.test(value),
		required: true,
	},
	{
		id: "uppercase",
		label: "One uppercase character",
		test: (value: string) => /[A-Z]/.test(value),
		required: true,
	},
	{
		id: "number",
		label: "One number",
		test: (value: string) => /\d/.test(value),
		required: true,
	},
	{
		id: "symbol",
		label: "One symbol",
		test: (value: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
		required: false,
	},
]

export const STRENGTH_BAR_COUNT = 5

export const barColorMap: Record<StrengthLabel | "empty", string> = {
	weak: "bg-rose-500",
	average: "bg-amber-400",
	strong: "bg-lime-400",
	superStrong: "bg-emerald-500",
	empty: "bg-default-200",
}

export const strengthColorMap: Record<StrengthLabel, string> = {
	weak: "text-danger",
	average: "text-warning",
	strong: "text-success",
	superStrong: "text-success",
}

export const strengthLabelMap: Record<StrengthLabel, string> = {
	weak: "Weak",
	average: "Average",
	strong: "Strong",
	superStrong: "Super Strong",
}
