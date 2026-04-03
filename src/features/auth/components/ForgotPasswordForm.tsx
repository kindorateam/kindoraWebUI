import { Button, Card, FieldError, InputGroup, Label, TextField, toast } from "@heroui/react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"

import { EMAIL_PATTERN } from "../constants"
import { useRequestPasswordReset } from "../hooks/useAuthMutations"

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
	const requestResetMutation = useRequestPasswordReset()

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid },
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

	const onSubmit = (data: ForgotPasswordFormData) => {
		requestResetMutation.mutate(data.email, {
			onSuccess: () => {
				const sentAt = Date.now()
				setSubmittedEmail(data.email)
				setCodeSentAt(sentAt)
				setEmailSent(true)
			},
			onError: (error) => {
				toast("Failed to send reset email", { description: getErrorMessage(error), variant: "danger" })
			},
		})
	}

	const handleNext = () => {
		if (codeSentAt) {
			onNext(submittedEmail, codeSentAt)
		}
	}

	if (emailSent) {
		return <ForgotPasswordConfirmation email={submittedEmail} onNext={handleNext} />
	}

	return (
		<>
			<Card.Header>
				<h1 className="font-semibold text-xl">Forgot Password?</h1>
			</Card.Header>

			<Card.Content className="gap-4">
				<p className="text-default-500 text-sm">We will email you a code to your email address</p>

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<TextField isRequired isInvalid={!!errors.email} variant="secondary">
							<Label>Email</Label>
							<InputGroup>
								<InputGroup.Input {...field} placeholder="Enter your email" type="email" />
							</InputGroup>
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

			<Card.Footer className="flex-col gap-4">
				<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
					<Button
						fullWidth
						variant="primary"
						isDisabled={!isValid}
						isPending={requestResetMutation.isPending}
						size="md"
						type="submit"
					>
						Next
					</Button>
				</form>
				<Button fullWidth onPress={onBack} size="md" variant="outline">
					Back
				</Button>
			</Card.Footer>
		</>
	)
}

export default ForgotPasswordForm
