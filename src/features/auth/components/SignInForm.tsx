import { Button, Card, Checkbox, FieldError, InputGroup, Label, Link, Separator, TextField, toast } from "@heroui/react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"
import LogosGoogleIcon from "~icons/logos/google-icon"

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
	const { handleGoogleLogin, emailLoginMutation, isLoading } = useAuth()
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<SignInFormData>({
		defaultValues: {
			email: defaultEmail || "",
			password: "",
			rememberMe: false,
		},
		mode: "onChange",
	})

	const onSubmit = (data: SignInFormData) => {
		emailLoginMutation.mutate(
			{ email: data.email, password: data.password },
			{
				onSuccess: (result) => {
					if (result.needsVerification) {
						onVerificationRequired?.(result.email, result.message, Date.now())
					}
				},
				onError: (error) => {
					toast("Login failed", { description: getErrorMessage(error), variant: "danger" })
				},
			},
		)
	}

	return (
		<>
			<Card.Header>
				<h1 className="font-semibold text-xl">Sign in</h1>
			</Card.Header>

			<Card.Content className="gap-4">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4 flex flex-col gap-3">
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
						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<TextField isRequired isInvalid={!!errors.password} variant="secondary">
									<Label>Password</Label>
									<InputGroup>
										<InputGroup.Input
											{...field}
											placeholder="Enter your password"
											type={isPasswordVisible ? "text" : "password"}
										/>
										<InputGroup.Suffix>
											<PasswordVisibilityToggle
												isVisible={isPasswordVisible}
												onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
											/>
										</InputGroup.Suffix>
									</InputGroup>
									<FieldError>{errors.password?.message}</FieldError>
								</TextField>
							)}
							rules={{
								required: "Password is required",
							}}
						/>
					</div>
					<div className="flex items-center justify-between">
						<Controller
							control={control}
							name="rememberMe"
							render={({ field: { value, onChange, ...field } }) => (
								<Checkbox {...field} isSelected={value} onChange={onChange}>
									<Checkbox.Control>
										<Checkbox.Indicator />
									</Checkbox.Control>
									<Checkbox.Content>
										<Label>Remember me</Label>
									</Checkbox.Content>
								</Checkbox>
							)}
						/>
						<Link onPress={onForgotPassword}>Forgot password?</Link>
					</div>

					<Button
						className="mt-5"
						fullWidth
						variant="primary"
						isDisabled={!isValid}
						isPending={emailLoginMutation.isPending}
						size="md"
						type="submit"
					>
						Sign In
					</Button>
				</form>
			</Card.Content>
			<Card.Footer className="flex-col gap-4">
				<div className="flex items-center gap-4">
					<Separator className="flex-1" />
					<span className="text-default-400 text-sm">OR</span>
					<Separator className="flex-1" />
				</div>

				<Button
					fullWidth
					isDisabled={isLoading}
					isPending={isLoading}
					onPress={() => {
						handleGoogleLogin()
					}}
					variant="outline"
				>
					<LogosGoogleIcon /> Sign in with Google
				</Button>
			</Card.Footer>
		</>
	)
}

export default SignInForm
