import { Button, CardBody, CardFooter, CardHeader, Input } from "@heroui/react"
import { useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { requestPasswordReset } from "../services/auth.service"

import ForgotPasswordConfirmation from "./ForgotPasswordConfirmation"

import type { ForgotPasswordFormData } from "../types"

interface ForgotPasswordFormProps {
	onBack: () => void
	onNext: (email: string) => void
}

const ForgotPasswordForm = ({ onBack, onNext }: ForgotPasswordFormProps) => {
	const [emailSent, setEmailSent] = useState(false)
	const [submittedEmail, setSubmittedEmail] = useState("")
	const [error, setError] = useState<string | null>(null)

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<ForgotPasswordFormData>({
		defaultValues: {
			email: "",
		},
		mode: "onChange",
	})

	const onSubmit = useCallback(async (data: ForgotPasswordFormData) => {
		try {
			setError(null)
			await requestPasswordReset(data.email)
			setSubmittedEmail(data.email)
			setEmailSent(true)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.")
		}
	}, [])

	const handleNext = useCallback(() => {
		onNext(submittedEmail)
	}, [onNext, submittedEmail])

	if (emailSent) {
		return <ForgotPasswordConfirmation email={submittedEmail} onNext={handleNext} />
	}

	return (
		<>
			<CardHeader className="px-7 pt-8 pb-4">
				<h1 className="font-semibold text-xl">Forgot Password?</h1>
			</CardHeader>

			<CardBody className="gap-4 px-7 pt-4 pb-4">
				<p className="text-gray-600 text-sm">We will email you a code to your email address</p>

				{error && <div className="rounded-md bg-danger-50 p-3 text-danger text-sm">{error}</div>}

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.email?.message}
							isInvalid={!!errors.email}
							isRequired
							label="Email"
							labelPlacement="inside"
							placeholder="Enter your email"
							radius="md"
							size="sm"
							type="email"
							variant="flat"
						/>
					)}
					rules={{
						required: "Email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "Invalid email address",
						},
					}}
				/>
			</CardBody>

			<CardFooter className="flex-col gap-4 px-7 pt-4 pb-8">
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
				<Button className="w-full" onPress={onBack} size="md" variant="bordered">
					Back
				</Button>
			</CardFooter>
		</>
	)
}

export default ForgotPasswordForm
