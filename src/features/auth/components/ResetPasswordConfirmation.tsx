import { Button, CardBody } from "@heroui/react"

interface ResetPasswordConfirmationProps {
	onBackToSignIn: () => void
}

const shieldIconBase = "http://localhost:3845/assets/6d5e19d8d37df5f59227d4adeb427274fd585795.svg"
const shieldIconCheck1 = "http://localhost:3845/assets/3e676e2641f9bbc5afdd76ffd29f844980dbd272.svg"
const shieldIconCheck2 = "http://localhost:3845/assets/f52e6248518522c15ff5b3dabedaa29a701de364.svg"

export default function ResetPasswordConfirmation({ onBackToSignIn }: ResetPasswordConfirmationProps) {
	return (
		<CardBody className="flex flex-col items-center gap-5 px-7 py-8">
			<div className="flex flex-col items-center gap-3">
				<div className="relative h-[74px] w-[70px] overflow-clip">
					<div className="absolute inset-0">
						<img alt="" className="block size-full max-w-none" src={shieldIconBase} />
					</div>
					<div className="absolute inset-[20.71%_34.35%_58.14%_34.35%]">
						<img alt="" className="block size-full max-w-none" src={shieldIconCheck1} />
					</div>
					<div className="absolute inset-[40.02%_29.93%_31.38%_29.92%]">
						<img alt="" className="block size-full max-w-none" src={shieldIconCheck2} />
					</div>
				</div>
				<h2 className="text-center font-medium text-xl leading-7">Your password has been updated</h2>
				<p className="text-center text-foreground text-sm leading-5">You will be directed to the homepage</p>
			</div>

			<Button className="w-full" color="primary" onPress={onBackToSignIn} size="md">
				Back to Sign In
			</Button>
		</CardBody>
	)
}
