import { Button, CardBody, CardFooter, CardHeader, Checkbox, Divider, Input, Link } from "@heroui/react"
import { useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import useAuth from "../hooks/useAuth"

import type { SignInFormData } from "../types"

interface SignInFormProps {
	onForgotPassword: () => void
	onSignInSuccess: (email: string) => void
	onVerificationRequired?: (email: string, message: string) => void
	defaultEmail?: string
}

const SignInForm = ({ onForgotPassword, onSignInSuccess, onVerificationRequired, defaultEmail }: SignInFormProps) => {
	const { handleGoogleLogin, handleEmailLogin, error, isLoading } = useAuth()
	const [_verificationState, setVerificationState] = useState<{
		email: string
		message: string
	} | null>(null)

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<SignInFormData>({
		defaultValues: {
			email: defaultEmail || "",
			password: "",
			rememberMe: false,
		},
		mode: "onChange",
	})

	const onSubmit = useCallback(
		async (data: SignInFormData) => {
			try {
				const result = await handleEmailLogin({
					email: data.email,
					password: data.password,
				})

				// Case 1: Verification required (new user)
				if (result?.needsVerification) {
					setVerificationState({ email: result.email, message: result.message })
					if (onVerificationRequired) {
						onVerificationRequired(result.email, result.message)
					} else {
						console.warn("[SignInForm] onVerificationRequired callback is not defined!")
					}
					return
				}

				// Case 2: Login successful (verified user)
				onSignInSuccess(data.email)
			} catch (error) {
				// Error is already handled in the auth store and displayed via error state
				console.error("[SignInForm] Login failed with error:", error)
				console.error("[SignInForm] Error stack:", error instanceof Error ? error.stack : "No stack trace")
			}
		},
		[handleEmailLogin, onSignInSuccess, onVerificationRequired],
	)

	return (
		<>
			<CardHeader className="px-7 pt-8 pb-4">
				<h1 className="font-semibold text-xl">Sign in</h1>
			</CardHeader>

			<CardBody className="gap-4 px-7 pt-4 pb-4">
				{error && (
					<div className="rounded-md bg-red-50 p-3 text-red-600 text-sm" role="alert">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4 flex flex-col gap-3">
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
						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<Input
									{...field}
									errorMessage={errors.password?.message}
									isInvalid={!!errors.password}
									label="Password"
									labelPlacement="inside"
									placeholder="Enter your password"
									radius="md"
									size="sm"
									type="password"
									variant="flat"
								/>
							)}
							rules={{
								required: "Password is required",
							}}
						/>
					</div>
					<div className="flex h-10 items-center justify-between">
						<Controller
							control={control}
							name="rememberMe"
							render={({ field: { value, onChange, ...field } }) => (
								<Checkbox {...field} isSelected={value} onValueChange={onChange}>
									<span className="text-sm">Remember me</span>
								</Checkbox>
							)}
						/>
						<Link
							className="cursor-pointer rounded-xl px-3 py-0 font-normal text-default-400 text-xs leading-4"
							onPress={onForgotPassword}
							underline="none"
						>
							Forgot password?
						</Link>
					</div>

					<Button
						className="mt-5 w-full"
						color="primary"
						isDisabled={!isValid}
						isLoading={isSubmitting}
						size="md"
						type="submit"
					>
						Sign In
					</Button>
				</form>
			</CardBody>
			<CardFooter className="flex-col px-7 pt-4 pb-8">
				<div className="flex items-center gap-4 py-4">
					<Divider className="flex-1" />
					<span className="text-default-400 text-small">OR</span>
					<Divider className="flex-1" />
				</div>

				<Button
					className="w-full"
					isDisabled={isLoading}
					isLoading={isLoading}
					onPress={() => {
						void handleGoogleLogin()
					}}
					variant="bordered"
				>
					Continue with Google
				</Button>
			</CardFooter>
		</>
	)
}

export default SignInForm
