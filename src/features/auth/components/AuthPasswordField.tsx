import { FieldError, InputGroup, Label, TextField } from "@heroui/react"
import { useState } from "react"
import { Controller } from "react-hook-form"

import PasswordVisibilityToggle from "./PasswordVisibilityToggle"

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form"

interface AuthPasswordFieldProps<T extends FieldValues> {
	control: Control<T>
	label: string
	name: FieldPathByValue<T, string>
	placeholder: string
	requiredMessage: string
	validate?: (value: string) => true | string
}

const AuthPasswordField = <T extends FieldValues>({
	control,
	label,
	name,
	placeholder,
	requiredMessage,
	validate,
}: AuthPasswordFieldProps<T>) => {
	const [isVisible, setIsVisible] = useState(false)

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<TextField isInvalid={!!fieldState.error} isRequired variant="secondary">
					<Label>{label}</Label>
					<InputGroup>
						<InputGroup.Input {...field} placeholder={placeholder} type={isVisible ? "text" : "password"} />
						<InputGroup.Suffix>
							<PasswordVisibilityToggle
								isVisible={isVisible}
								label={label}
								onToggle={() => setIsVisible((value) => !value)}
							/>
						</InputGroup.Suffix>
					</InputGroup>
					<FieldError>{fieldState.error?.message}</FieldError>
				</TextField>
			)}
			rules={{ required: requiredMessage, validate }}
		/>
	)
}

export default AuthPasswordField
