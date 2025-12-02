import { Button, CardBody, CardFooter, CardHeader, Checkbox, Divider, Input, Link } from "@heroui/react"
import { useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import MaterialIconThemeGoogle from "~icons/material-icon-theme/google"

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

	const onSubmit = useCallback(
		async (data: SignInFormData) => {
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
		},
		[handleEmailLogin, onVerificationRequired],
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
									value: EMAIL_PATTERN,
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
									endContent={
										<PasswordVisibilityToggle
											isVisible={isPasswordVisible}
											onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
										/>
									}
									errorMessage={errors.password?.message}
									isInvalid={!!errors.password}
									isRequired
									label="Password"
									labelPlacement="inside"
									placeholder="Enter your password"
									radius="md"
									size="sm"
									type={isPasswordVisible ? "text" : "password"}
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
				<div className="flex items-center gap-4 pb-4">
					<Divider className="flex-1" />
					<span className="text-default-400 text-small">OR</span>
					<Divider className="flex-1" />
				</div>

				<Button
					className="h-12 w-full"
					isDisabled={isLoading}
					isLoading={isLoading}
					onPress={() => {
						void handleGoogleLogin()
					}}
					startContent={<MaterialIconThemeGoogle className="size-5" />}
					variant="bordered"
				>
					Sign in with Google
				</Button>
			</CardFooter>
		</>
	)
}

export default SignInForm
