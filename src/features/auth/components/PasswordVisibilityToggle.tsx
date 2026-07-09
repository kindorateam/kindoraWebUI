import { useTranslation } from "react-i18next"

import SolarEyeClosedLinear from "~icons/solar/eye-closed-linear"
import SolarEyeLinear from "~icons/solar/eye-linear"

interface PasswordVisibilityToggleProps {
	isVisible: boolean
	onToggle: () => void
	label?: string
}

const PasswordVisibilityToggle = ({ isVisible, onToggle, label }: PasswordVisibilityToggleProps) => {
	const { t } = useTranslation()
	const inputLabel = label ?? t("auth.fields.password")
	const ariaLabel = isVisible
		? t("auth.passwordVisibility.hide", { label: inputLabel })
		: t("auth.passwordVisibility.show", { label: inputLabel })

	return (
		<button
			aria-label={ariaLabel}
			className="text-default-400"
			onClick={onToggle}
			onMouseDown={(event) => event.preventDefault()}
			type="button"
		>
			{isVisible ? <SolarEyeLinear className="size-5" /> : <SolarEyeClosedLinear className="size-5" />}
		</button>
	)
}

export default PasswordVisibilityToggle
