import { Button, CardBody } from "@heroui/react"

interface ForgotPasswordConfirmationProps {
	email: string
	onNext: () => void
}

const emailIllustration = "http://localhost:3845/assets/edb1cae15f848b29a02f78b3f408b9ef3a0034fc.svg"

const ForgotPasswordConfirmation = ({ email: _email, onNext }: ForgotPasswordConfirmationProps) => {
	return (
		<CardBody className="flex flex-col items-center gap-5 px-7 py-8">
			<div className="flex flex-col items-center gap-3">
				<div className="h-[74px] w-[150px]">
					<img alt="Email sent illustration" className="size-full" src={emailIllustration} />
				</div>
				<h2 className="text-center font-medium text-xl">Check your email</h2>
				<p className="text-center text-default-600 text-sm">
					We have sent a password recover instructions to your email
				</p>
			</div>

			<Button className="w-full" color="primary" onPress={onNext} size="md">
				Next
			</Button>
		</CardBody>
	)
}

export default ForgotPasswordConfirmation
