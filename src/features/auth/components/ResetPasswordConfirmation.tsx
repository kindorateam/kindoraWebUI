import { Button, Card } from "@heroui/react"
import { useTranslation } from "react-i18next"

import SolarShieldCheckBold from "~icons/solar/shield-check-bold"

interface ResetPasswordConfirmationProps {
	onBackToSignIn: () => void
}

const ResetPasswordConfirmation = ({ onBackToSignIn }: ResetPasswordConfirmationProps) => {
	const { t } = useTranslation()

	return (
		<Card.Content className="flex flex-col items-center gap-6 py-2">
			<div className="flex flex-col items-center gap-2">
				<SolarShieldCheckBold className="size-14 text-success" />
				<h2 className="text-center font-semibold text-xl">{t("auth.resetPassword.confirmationTitle")}</h2>
				<p className="text-center text-default-500 text-sm">{t("auth.resetPassword.confirmationDescription")}</p>
			</div>

			<Button fullWidth variant="primary" onPress={onBackToSignIn} size="lg">
				{t("auth.resetPassword.backToSignIn")}
			</Button>
		</Card.Content>
	)
}

export default ResetPasswordConfirmation
