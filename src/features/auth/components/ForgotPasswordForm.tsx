import { Button, Card, FieldError, Input, Label, TextField } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { EMAIL_PATTERN } from "../constants"
import { requestPasswordReset } from "../services/auth.service"

import ForgotPasswordConfirmation from "./ForgotPasswordConfirmation"

import type { ForgotPasswordFormData } from "../types"

interface ForgotPasswordFormProps {
	onBack: () => void
	onNext: (email: string, codeSentAt: number) => void
	defaultEmail?: string
}

const ForgotPasswordForm = ({ onBack, onNext, defaultEmail }: ForgotPasswordFormProps) => {
	const [emailSent, setEmailSent] = useState(false)
	const [submittedEmail, setSubmittedEmail] = useState("")
	const [codeSentAt, setCodeSentAt] = useState<number | null>(null)
	const [error, setError] = useState<string | null>(null)

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isValid },
	} = useForm<ForgotPasswordFormData>({
		defaultValues: {
			email: defaultEmail || "",
		},
		mode: "onChange",
	})

	useEffect(() => {
		if (defaultEmail) {
			reset({ email: defaultEmail })
		}
	}, [defaultEmail, reset])

	const onSubmit = useCallback(async (data: ForgotPasswordFormData) => {
		try {
			setError(null)
			await requestPasswordReset(data.email)
			const sentAt = Date.now()
			setSubmittedEmail(data.email)
			setCodeSentAt(sentAt)
			setEmailSent(true)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.")
		}
	}, [])

	const handleNext = useCallback(() => {
		if (codeSentAt) {
			onNext(submittedEmail, codeSentAt)
		}
	}, [onNext, submittedEmail, codeSentAt])

	if (emailSent) {
		return <ForgotPasswordConfirmation email={submittedEmail} onNext={handleNext} />
	}

	return (
		<>
			<Card.Header className="px-7 pt-8 pb-4">
				<h1 className="font-semibold text-xl">Forgot Password?</h1>
			</Card.Header>

			<Card.Content className="gap-4 px-7 pt-4 pb-4">
				<p className="text-gray-600 text-sm">We will email you a code to your email address</p>

				{error && <div className="rounded-md bg-danger-50 p-3 text-danger text-sm">{error}</div>}

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<TextField isRequired isInvalid={!!errors.email} variant="secondary">
							<Label>Email</Label>

							<Input {...field} placeholder="Enter your email" type="email" />

							<FieldError>{errors.email?.message}</FieldError>
						</TextField>
					)}
					rules={{
						required: "Email is required",
						pattern: {
							value: EMAIL_PATTERN,
							message: "Invalid email address",
						},
					}}
				/>
			</Card.Content>

			<Card.Footer className="flex-col gap-4 px-7 pt-4 pb-8">
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
				<Button className="w-full" onPress={onBack} size="md" variant="outline">
					Back
				</Button>
			</Card.Footer>
		</>
	)
}

export default ForgotPasswordForm
