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
			className="flex size-8 shrink-0 items-center justify-center self-center rounded-full text-default-400 transition-colors hover:bg-default-100 hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
			onClick={onToggle}
			onMouseDown={(event) => event.preventDefault()}
			type="button"
		>
			{isVisible ? <SolarEyeLinear className="size-5" /> : <SolarEyeClosedLinear className="size-5" />}
		</button>
	)
}

export default PasswordVisibilityToggle
