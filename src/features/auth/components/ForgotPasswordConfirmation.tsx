import { Button, Card } from "@heroui/react"
import { useTranslation } from "react-i18next"

import LineMdEmailCheck from "~icons/line-md/email-check"

interface ForgotPasswordConfirmationProps {
	email: string
	onNext: () => void
}

const ForgotPasswordConfirmation = ({ email, onNext }: ForgotPasswordConfirmationProps) => {
	const { t } = useTranslation()

	return (
		<Card.Content className="flex flex-col items-center gap-6 py-2">
			<div className="flex flex-col items-center gap-2">
				<LineMdEmailCheck className="size-14 text-warning" />
				<h2 className="text-center font-semibold text-xl">{t("auth.forgotPassword.confirmationTitle")}</h2>
				<p className="text-center text-default-500 text-sm">
					{t("auth.forgotPassword.confirmationDescription", { email })}
				</p>
			</div>

			<Button fullWidth variant="primary" onPress={onNext} size="lg">
				{t("common.next")}
			</Button>
		</Card.Content>
	)
}

export default ForgotPasswordConfirmation
