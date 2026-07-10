import { useState } from "react"
import { useTranslation } from "react-i18next"

import PhPlusBold from "~icons/ph/plus-bold"
import PhXBold from "~icons/ph/x-bold"

interface MealTagFieldProps {
	id: string
	label: string
	placeholder: string
	helperText: string
	values: string[]
	onChange: (values: string[]) => void
	isRequired?: boolean
}

const MealTagField = ({
	id,
	label,
	placeholder,
	helperText,
	values,
	onChange,
	isRequired = false,
}: MealTagFieldProps) => {
	const { t } = useTranslation()
	const [draft, setDraft] = useState("")

	const addDraftValues = () => {
		const nextValues = draft
			.split(",")
			.map((value) => value.trim())
			.filter(Boolean)

		if (nextValues.length === 0) return

		const existingValues = new Set(values.map((value) => value.toLocaleLowerCase()))
		onChange([...values, ...nextValues.filter((value) => !existingValues.has(value.toLocaleLowerCase()))])
		setDraft("")
	}

	const removeValue = (valueToRemove: string) => {
		onChange(values.filter((value) => value !== valueToRemove))
	}

	return (
		<div className="grid gap-1.5">
			<label className="font-medium text-foreground text-sm" htmlFor={id}>
				{label}
				{isRequired && <span className="text-danger"> *</span>}
			</label>
			<div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl bg-default px-3 py-1.5 ring-2 ring-transparent transition-[background-color,box-shadow] focus-within:ring-focus hover:bg-default-hover">
				{values.map((value) => (
					<span
						className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-default-700 text-sm shadow-sm"
						key={value}
					>
						{value}
						<button
							aria-label={t("meals.actions.removeTag", { value })}
							className="rounded text-default-400 transition-colors hover:text-danger focus-visible:outline-2 focus-visible:outline-primary"
							type="button"
							onClick={() => removeValue(value)}
						>
							<PhXBold aria-hidden className="size-3" />
						</button>
					</span>
				))}
				<input
					aria-describedby={`${id}-helper`}
					className="min-w-36 flex-1 bg-transparent py-1 text-foreground text-sm outline-none placeholder:text-default-400"
					id={id}
					placeholder={values.length === 0 ? placeholder : t("meals.placeholders.addAnother")}
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={(event) => {
						if (event.key !== "Enter" && event.key !== "," && event.key !== "Tab") return
						if (event.key !== "Tab") event.preventDefault()
						addDraftValues()
					}}
				/>
				{draft.trim() && (
					<button
						aria-label={t("meals.actions.addTag", { value: draft.trim() })}
						className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
						type="button"
						onClick={addDraftValues}
					>
						<PhPlusBold aria-hidden className="size-3.5" />
					</button>
				)}
			</div>
			<p className="text-default-500 text-xs leading-5" id={`${id}-helper`}>
				{helperText}
			</p>
		</div>
	)
}

export default MealTagField
