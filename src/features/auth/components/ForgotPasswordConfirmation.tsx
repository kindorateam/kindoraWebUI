import { Button, Card } from "@heroui/react"

import LineMdEmailCheck from "~icons/line-md/email-check"

interface ForgotPasswordConfirmationProps {
	email: string
	onNext: () => void
}

const ForgotPasswordConfirmation = ({ email: _email, onNext }: ForgotPasswordConfirmationProps) => {
	return (
		<Card.Content className="flex flex-col items-center gap-5">
			<div className="flex flex-col items-center gap-3">
				<LineMdEmailCheck className="size-16 text-warning" />
				<h2 className="text-center font-medium text-xl">Check your email</h2>
				<p className="text-center text-default-500 text-sm">
					We have sent a password recover instructions to your email
				</p>
			</div>

			<Button fullWidth variant="primary" onPress={onNext} size="md">
				Next
			</Button>
		</Card.Content>
	)
}

export default ForgotPasswordConfirmation
