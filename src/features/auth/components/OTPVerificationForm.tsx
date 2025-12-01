import { Button, CardBody, CardFooter, CardHeader, InputOtp, Link, Tooltip } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import PhClockCountdown from "~icons/ph/clock-countdown"
import TablerEdit from "~icons/tabler/edit"

import useAuth from "../hooks/useAuth"
import { verifyPasswordResetOTP } from "../services/auth.service"

import type { OTPVerificationFormData } from "../types"

interface OTPVerificationFormProps {
	email: string
	onBack: () => void
	onSuccess: (token?: string) => void
	context?: "login" | "password-reset"
}

const OTPVerificationForm = ({ email, onBack, onSuccess, context = "login" }: OTPVerificationFormProps) => {
	const { handleVerifyFirstLogin, error: authError } = useAuth()
	const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
	const [canResend, setCanResend] = useState(false)
	const [localError, setLocalError] = useState<string | null>(null)

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
		// TODO: Call API to resend OTP - mock implementation for now

		setTimeLeft(300) // Reset timer to 5 minutes
		setCanResend(false)
		setLocalError(null)
		// Show success feedback
		alert("A new verification code has been sent to your email")
	}, [email])

	const onSubmit = useCallback(
		async (data: OTPVerificationFormData) => {
			try {
				setLocalError(null)

				if (context === "login") {
					// First login verification flow
					await handleVerifyFirstLogin(email, data.otp)
					onSuccess()
				} else {
					// Password reset verification flow
					await verifyPasswordResetOTP(email, data.otp)
					// Pass the OTP token to the next step for password reset
					onSuccess(data.otp)
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Verification failed. Please try again."
				if (context === "password-reset") {
					setLocalError(errorMessage)
				}
				console.error("Verification failed:", error)
			}
		},
		[context, email, handleVerifyFirstLogin, onSuccess],
	)

	// Use local error for password reset, auth error for login
	const displayError = context === "password-reset" ? localError : authError

	return (
		<>
			<CardHeader className="px-7 pt-8 pb-0">
				<h1 className="font-medium text-2xl">We email you a code</h1>
			</CardHeader>

			<CardBody className="gap-4 px-7 pt-4 pb-5">
				{displayError && (
					<div className="rounded-md bg-red-50 p-3 text-red-600 text-sm" role="alert">
						{displayError}
					</div>
				)}

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<p className="text-default-600 text-sm">Enter the verification code sent to</p>
						<div className="flex items-center gap-1">
							<p className="text-sm text-warning">{email}</p>
							<Tooltip content="Change email">
								<Button className="size-6 min-w-6" isIconOnly onPress={onBack} variant="light">
									<TablerEdit className="size-4 text-warning" />
								</Button>
							</Tooltip>
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
									size="lg"
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
							<PhClockCountdown className="size-5 text-warning" />
							<p className="text-sm text-warning">min</p>
						</div>
					</div>
				</div>
			</CardBody>

			<CardFooter className="flex-col gap-4 px-7 pt-0 pb-8">
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
