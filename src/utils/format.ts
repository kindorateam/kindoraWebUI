export const formatNumber = (value: number): string => {
	return new Intl.NumberFormat().format(value)
}

export const formatCurrency = (value: number, currency = "USD"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(value)
}

export const formatDate = (date: Date | string): string => {
	const d = typeof date === "string" ? new Date(date) : date
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(d)
}

export const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncate = (str: string, length: number): string => {
	return str.length > length ? `${str.substring(0, length)}...` : str
}

export const formatUSPhone = (value: string): string => {
	const digits = value.replace(/\D/g, "").slice(0, 10)
	if (digits.length <= 3) return digits
	if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
