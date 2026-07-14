import { FieldError, InputGroup, Label, TextField } from "@heroui/react"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { EMAIL_PATTERN } from "../constants"

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form"

interface AuthEmailFieldProps<T extends FieldValues> {
	control: Control<T>
	name: FieldPathByValue<T, string>
}

const AuthEmailField = <T extends FieldValues>({ control, name }: AuthEmailFieldProps<T>) => {
	const { t } = useTranslation()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<TextField isInvalid={!!fieldState.error} isRequired>
					<Label>{t("auth.fields.email")}</Label>
					<InputGroup className="[--field-focus:var(--default)]" variant="secondary">
						<InputGroup.Input {...field} placeholder={t("auth.placeholders.email")} type="email" />
					</InputGroup>
					<FieldError>{fieldState.error?.message}</FieldError>
				</TextField>
			)}
			rules={{
				pattern: { message: t("auth.validation.invalidEmail"), value: EMAIL_PATTERN },
				required: t("auth.validation.emailRequired"),
			}}
		/>
	)
}

export default AuthEmailField
