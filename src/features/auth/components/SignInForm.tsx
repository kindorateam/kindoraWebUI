import { Button, Card, Checkbox, FieldError, Input, Label, Link, Separator, TextField } from "@heroui/react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { EMAIL_PATTERN } from "../constants"
import useAuth from "../hooks/useAuth"

import PasswordVisibilityToggle from "./PasswordVisibilityToggle"

import type { SignInFormData } from "../types"

interface SignInFormProps {
	onForgotPassword: () => void
	onVerificationRequired?: (email: string, message: string, codeSentAt: number) => void
	defaultEmail?: string
}

const SignInForm = ({ onForgotPassword, onVerificationRequired, defaultEmail }: SignInFormProps) => {
	const { handleGoogleLogin, handleEmailLogin, error, isLoading } = useAuth()
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

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

	const onSubmit = async (data: SignInFormData) => {
		try {
			const result = await handleEmailLogin({
				email: data.email,
				password: data.password,
			})

			if (result?.needsVerification) {
				const codeSentAt = Date.now()
				onVerificationRequired?.(result.email, result.message, codeSentAt)
			}
		} catch (error) {
			console.error("[SignInForm] Login failed:", error)
		}
	}

	return (
		<>
			<Card.Header className="px-7 pt-8 pb-4">
				<h1 className="font-semibold text-xl">Sign in</h1>
			</Card.Header>

			<Card.Content className="gap-4 px-7 pt-4 pb-4">
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
						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<TextField isRequired isInvalid={!!errors.password} variant="secondary">
									<Label>Password</Label>
									<Input {...field} placeholder="Enter your password" type={isPasswordVisible ? "text" : "password"} />
									<PasswordVisibilityToggle
										isVisible={isPasswordVisible}
										onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
									/>
									<FieldError>{errors.password?.message}</FieldError>
								</TextField>
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
								<Checkbox {...field} isSelected={value} onChange={onChange}>
									<Checkbox.Control>
										<Checkbox.Indicator />
									</Checkbox.Control>
									<Checkbox.Content>
										<Label className="text-sm">Remember me</Label>
									</Checkbox.Content>
								</Checkbox>
							)}
						/>
						<Link
							className="cursor-pointer rounded-xl px-3 py-0 font-normal text-default-400 text-xs leading-4 no-underline"
							onPress={onForgotPassword}
						>
							Forgot password?
						</Link>
					</div>

					<Button
						className="mt-5 w-full"
						variant="primary"
						isDisabled={!isValid}
						isPending={isSubmitting}
						size="md"
						type="submit"
					>
						Sign In
					</Button>
				</form>
			</Card.Content>
			<Card.Footer className="flex-col px-7 pt-4 pb-8">
				<div className="flex items-center gap-4 pb-4">
					<Separator className="flex-1" />
					<span className="text-default-400 text-sm">OR</span>
					<Separator className="flex-1" />
				</div>

				<Button
					className="h-12 w-full"
					isDisabled={isLoading}
					isPending={isLoading}
					onPress={() => {
						void handleGoogleLogin()
					}}
					variant="outline"
				>
					Sign in with Google
				</Button>
			</Card.Footer>
		</>
	)
}

export default SignInForm
