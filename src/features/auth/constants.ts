export type StrengthLabel = "weak" | "fair" | "good" | "strong"

export const passwordRequirements = [
	{
		id: "length",
		label: "At least 8 characters long",
		test: (value: string) => value.length >= 8,
	},
	{
		id: "lowercase",
		label: "One lowercase character",
		test: (value: string) => /[a-z]/.test(value),
	},
	{
		id: "uppercase",
		label: "One uppercase character",
		test: (value: string) => /[A-Z]/.test(value),
	},
	{
		id: "numberOrSymbol",
		label: "One number or symbol",
		test: (value: string) => /[\d\W_]/.test(value),
	},
]

export const barColorMap: Record<StrengthLabel | "empty", string> = {
	weak: "bg-rose-500",
	fair: "bg-amber-400",
	good: "bg-lime-400",
	strong: "bg-emerald-500",
	empty: "bg-default-200",
}

export const strengthColorMap: Record<StrengthLabel | "empty", string> = {
	weak: "text-danger",
	fair: "text-warning",
	good: "text-success",
	strong: "text-success",
	empty: "text-default-400",
}
