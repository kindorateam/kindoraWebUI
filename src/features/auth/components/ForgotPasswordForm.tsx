import { Button, CardBody, CardFooter, CardHeader, Input } from "@heroui/react"
import { useCallback } from "react"
import { Controller, useForm } from "react-hook-form"

import type { ForgotPasswordFormData } from "../types"

interface ForgotPasswordFormProps {
	onBack: () => void
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
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

	// TODO: Integrate with API
	const onSubmit = useCallback(async (data: ForgotPasswordFormData) => {
		console.log("Forgot password form data:", data)
		// TODO: Call API endpoint to send password reset email
		// TODO: Handle success/error responses
		// TODO: Show next step (confirmation screen)
	}, [])

	return (
		<>
			<CardHeader className="px-7 pt-8 pb-4">
				<h1 className="font-semibold text-xl">Forgot Password?</h1>
			</CardHeader>

			<CardBody className="gap-4 px-7 pt-4 pb-4">
				<p className="text-gray-600 text-sm">We will email you a code to your email address</p>

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
