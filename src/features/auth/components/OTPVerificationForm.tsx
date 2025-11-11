import { Button, CardBody, CardFooter, CardHeader, InputOtp, Link } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import type { OTPVerificationFormData } from "../types"

interface OTPVerificationFormProps {
	email: string
	onBack: () => void
	onSuccess: () => void
}

const OTPVerificationForm = ({ email, onBack, onSuccess }: OTPVerificationFormProps) => {
	const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
	const [canResend, setCanResend] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<OTPVerificationFormData>({
		defaultValues: {
			otp: "",
		},
		mode: "onChange",
	})

	// Timer countdown
	useEffect(() => {
		if (timeLeft <= 0) {
			setCanResend(true)
			return
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1)
		}, 1000)

		return () => clearInterval(timer)
	}, [timeLeft])

	// Format time as MM:SS
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
	}

	const handleResendCode = useCallback(() => {
		// TODO: Call API to resend OTP
		console.log("Resending code to:", email)
		setTimeLeft(300) // Reset timer to 5 minutes
		setCanResend(false)
	}, [email])

	// TODO: Integrate with API
	const onSubmit = useCallback(
		async (data: OTPVerificationFormData) => {
			console.log("OTP verification data:", data)
			// TODO: Call API endpoint to verify OTP
			// TODO: Handle success/error responses
			// TODO: Call onSuccess callback if verification succeeds
			onSuccess()
		},
		[onSuccess],
	)

	return (
		<>
			<CardHeader className="px-7 pt-8 pb-4">
				<h1 className="font-medium text-2xl">We email you a code</h1>
			</CardHeader>

			<CardBody className="gap-4 px-7 pt-4 pb-4">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<p className="text-default-600 text-sm">Enter the verification code sent to</p>
						<div className="flex items-center gap-2">
							<p className="text-sm text-warning">{email}</p>
							<Button className="h-auto min-w-0 p-0" isIconOnly onPress={onBack} size="sm" variant="light">
								<svg
									className="size-4"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Button>
						</div>
					</div>

					<div className="mx-auto">
						<Controller
							control={control}
							name="otp"
							render={({ field }) => (
								<InputOtp
									{...field}
									color={errors.otp ? "danger" : "default"}
									errorMessage={errors.otp?.message}
									isInvalid={!!errors.otp}
									isRequired
									length={6}
									size="md"
									variant="bordered"
								/>
							)}
							rules={{
								required: "Verification code is required",
								minLength: {
									value: 6,
									message: "Code must be 6 digits",
								},
								pattern: {
									value: /^[0-9]{6}$/,
									message: "Code must contain only digits",
								},
							}}
						/>
					</div>

					<div className="flex items-center justify-between">
						<p className="text-default-600 text-sm">This temporary code will expire in</p>
						<div className="flex items-center gap-1">
							<p className="text-sm text-warning">{formatTime(timeLeft)}</p>
							<svg
								className="size-5 text-warning"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									clipRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
									fillRule="evenodd"
								/>
							</svg>
							<p className="text-sm text-warning">min</p>
						</div>
					</div>
				</div>
			</CardBody>

			<CardFooter className="flex-col gap-3 px-7 pt-4 pb-8">
				<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
					<Button
						className="w-full"
						color="primary"
						isDisabled={!isValid}
						isLoading={isSubmitting}
						size="md"
						type="submit"
					>
						Next
					</Button>
				</form>

				<div className="flex w-full items-center justify-between">
					<p className="text-default-600 text-sm">Didn't get your code?</p>
					<Link
						className="cursor-pointer text-primary text-xs"
						isDisabled={!canResend && timeLeft > 0}
						onPress={handleResendCode}
						underline="none"
					>
						Send a new code
					</Link>
				</div>
			</CardFooter>
		</>
	)
}

export default OTPVerificationForm
