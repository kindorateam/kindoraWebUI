import { Button, Card, InputOTP, Link, Tooltip } from "@heroui/react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import PhClockCountdown from "~icons/ph/clock-countdown"
import TablerEdit from "~icons/tabler/edit"

import { CODE_EXPIRATION_SECONDS, RESEND_COOLDOWN_SECONDS } from "../constants"
import useAuth from "../hooks/useAuth"
import { requestPasswordReset, verifyPasswordResetOTP } from "../services/auth.service"
import { calculateResendTimeLeft, calculateTimeLeft, formatTime } from "../utils/time"

import type { OTPVerificationFormData } from "../types"

interface OTPVerificationFormProps {
	email: string
	onBack: () => void
	onSuccess?: (token?: string) => void
	context?: "login" | "password-reset"
	codeSentAt: number | null
}

const OTPVerificationForm = ({ email, onBack, onSuccess, context = "login", codeSentAt }: OTPVerificationFormProps) => {
	const { handleVerifyFirstLogin, error: authError } = useAuth()
	const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(codeSentAt))
	const [resendTimeLeft, setResendTimeLeft] = useState(() => calculateResendTimeLeft(codeSentAt))
	const [localError, setLocalError] = useState<string | null>(null)

	const {
		control,
		handleSubmit,
		formState: { isSubmitting, isValid },
	} = useForm<OTPVerificationFormData>({
		defaultValues: {
			otp: "",
		},
		mode: "onChange",
	})

	useEffect(() => {
		if (codeSentAt) {
			setTimeLeft(calculateTimeLeft(codeSentAt))
			setResendTimeLeft(calculateResendTimeLeft(codeSentAt))
		}
	}, [codeSentAt])

	useEffect(() => {
		if (timeLeft <= 0 && resendTimeLeft <= 0) {
			return
		}

		const timer = setInterval(() => {
			if (timeLeft > 0) {
				setTimeLeft((prev) => prev - 1)
			}
			if (resendTimeLeft > 0) {
				setResendTimeLeft((prev) => prev - 1)
			}
		}, 1000)

		return () => clearInterval(timer)
	}, [timeLeft, resendTimeLeft])

	const handleResendCode = async () => {
		try {
			setLocalError(null)
			await requestPasswordReset(email)
			setTimeLeft(CODE_EXPIRATION_SECONDS)
			setResendTimeLeft(RESEND_COOLDOWN_SECONDS)
		} catch (error) {
			setLocalError(error instanceof Error ? error.message : "Failed to resend code. Please try again.")
		}
	}

	const onSubmit = async (data: OTPVerificationFormData) => {
		try {
			setLocalError(null)

			if (context === "login") {
				await handleVerifyFirstLogin(email, data.otp)
				onSuccess?.()
			} else {
				await verifyPasswordResetOTP(email, data.otp)
				onSuccess?.(data.otp)
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Verification failed. Please try again."
			if (context === "password-reset") {
				setLocalError(errorMessage)
			}
			console.error("Verification failed:", error)
		}
	}

	const displayError = context === "password-reset" ? localError : authError

	return (
		<>
			<Card.Header className="px-7 pt-8 pb-0">
				<h1 className="font-medium text-2xl">We email you a code</h1>
			</Card.Header>

			<Card.Content className="gap-4 px-7 pt-4 pb-5">
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
							<Tooltip>
								<Button className="size-6 min-w-6" isIconOnly onPress={onBack} variant="ghost">
									<TablerEdit className="size-4 text-warning" />
								</Button>
								<Tooltip.Content>Change email</Tooltip.Content>
							</Tooltip>
						</div>
					</div>

					<div className="mx-auto">
						<Controller
							control={control}
							name="otp"
							render={({ field }) => (
								<InputOTP {...field} maxLength={6}>
									<InputOTP.Group>
										<InputOTP.Slot index={0} />
										<InputOTP.Slot index={1} />
										<InputOTP.Slot index={2} />
									</InputOTP.Group>
									<InputOTP.Separator />
									<InputOTP.Group>
										<InputOTP.Slot index={3} />
										<InputOTP.Slot index={4} />
										<InputOTP.Slot index={5} />
									</InputOTP.Group>
								</InputOTP>
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
			</Card.Content>

			<Card.Footer className="flex-col gap-4 px-7 pt-0 pb-8">
				<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
					<Button
						className="w-full"
						variant="primary"
						isDisabled={!isValid}
						isPending={isSubmitting}
						size="md"
						type="submit"
					>
						Next
					</Button>
				</form>

				<div className="flex w-full items-center justify-between">
					<p className="text-default-600 text-sm">Didn't get your code?</p>
					{resendTimeLeft > 0 ? (
						<span className="text-default-400 text-xs">Send a new code in {resendTimeLeft}s</span>
					) : (
						<Link className="cursor-pointer text-primary text-xs underline" onPress={handleResendCode}>
							Send a new code
						</Link>
					)}
				</div>
			</Card.Footer>
		</>
	)
}

export default OTPVerificationForm
