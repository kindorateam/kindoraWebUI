import { Button, Card, InputOTP, Link, Tooltip, toast } from "@heroui/react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"
import PhClockCountdown from "~icons/ph/clock-countdown"
import TablerEdit from "~icons/tabler/edit"

import { CODE_EXPIRATION_SECONDS, RESEND_COOLDOWN_SECONDS } from "../constants"
import useAuth from "../hooks/useAuth"
import { useRequestPasswordReset, useVerifyPasswordResetOTP } from "../hooks/useAuthMutations"
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
	const { verifyMutation } = useAuth()
	const resendMutation = useRequestPasswordReset()
	const verifyResetOTPMutation = useVerifyPasswordResetOTP()
	const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(codeSentAt))
	const [resendTimeLeft, setResendTimeLeft] = useState(() => calculateResendTimeLeft(codeSentAt))

	const {
		control,
		handleSubmit,
		formState: { isValid },
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

	const handleResendCode = () => {
		resendMutation.mutate(email, {
			onSuccess: () => {
				setTimeLeft(CODE_EXPIRATION_SECONDS)
				setResendTimeLeft(RESEND_COOLDOWN_SECONDS)
			},
			onError: (error) => {
				toast("Failed to resend code", { description: getErrorMessage(error), variant: "danger" })
			},
		})
	}

	const onSubmit = (data: OTPVerificationFormData) => {
		if (context === "login") {
			verifyMutation.mutate(
				{ email, code: data.otp },
				{
					onSuccess: () => onSuccess?.(),
					onError: (error) => {
						toast("Verification failed", { description: getErrorMessage(error), variant: "danger" })
					},
				},
			)
		} else {
			verifyResetOTPMutation.mutate(
				{ email, code: data.otp },
				{
					onSuccess: () => onSuccess?.(data.otp),
					onError: (error) => {
						toast("Verification failed", { description: getErrorMessage(error), variant: "danger" })
					},
				},
			)
		}
	}

	const isPending = context === "login" ? verifyMutation.isPending : verifyResetOTPMutation.isPending

	return (
		<>
			<Card.Header>
				<h1 className="font-medium text-2xl">We email you a code</h1>
			</Card.Header>

			<Card.Content className="gap-4">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<p className="text-default-500 text-sm">Enter the verification code sent to</p>
						<div className="flex items-center gap-1">
							<p className="text-sm text-warning">{email}</p>
							<Tooltip>
								<Button isIconOnly onPress={onBack} size="sm" variant="ghost">
									<TablerEdit className="text-warning" />
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
						<p className="text-default-500 text-sm">This temporary code will expire in</p>
						<div className="flex items-center gap-1">
							<p className="text-sm text-warning">{formatTime(timeLeft)}</p>
							<PhClockCountdown className="text-warning" />
							<p className="text-sm text-warning">min</p>
						</div>
					</div>
				</div>
			</Card.Content>

			<Card.Footer className="flex-col gap-4">
				<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
					<Button fullWidth variant="primary" isDisabled={!isValid} isPending={isPending} size="md" type="submit">
						Next
					</Button>
				</form>

				<div className="flex w-full items-center justify-between">
					<p className="text-default-500 text-sm">Didn't get your code?</p>
					{resendTimeLeft > 0 ? (
						<span className="text-default-400 text-xs">Send a new code in {resendTimeLeft}s</span>
					) : (
						<Link onPress={handleResendCode}>Send a new code</Link>
					)}
				</div>
			</Card.Footer>
		</>
	)
}

export default OTPVerificationForm
