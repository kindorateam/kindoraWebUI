import { Button, Card } from "@heroui/react"

import SolarShieldCheckBold from "~icons/solar/shield-check-bold"

interface ResetPasswordConfirmationProps {
	onBackToSignIn: () => void
}

const ResetPasswordConfirmation = ({ onBackToSignIn }: ResetPasswordConfirmationProps) => {
	return (
		<Card.Content className="flex flex-col items-center gap-5">
			<div className="flex flex-col items-center gap-3">
				<SolarShieldCheckBold className="size-16 text-success" />
				<h2 className="text-center font-medium text-xl">Your password has been updated</h2>
				<p className="text-center text-default-500 text-sm">You will be directed to the homepage</p>
			</div>

			<Button fullWidth variant="primary" onPress={onBackToSignIn} size="md">
				Back to Sign In
			</Button>
		</Card.Content>
	)
}

export default ResetPasswordConfirmation
