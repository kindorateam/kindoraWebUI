import { Button, CardBody, CardFooter, CardHeader, Checkbox, Input, Link } from "@heroui/react"
import { GoogleLogin } from "@react-oauth/google"
import { useCallback } from "react"
import { Controller, useForm } from "react-hook-form"

import useAuth from "@/hooks/useAuth"

import type { SignInFormData } from "../types"

interface SignInFormProps {
	onForgotPassword: () => void
	onSignInSuccess: (email: string) => void
}

const SignInForm = ({ onForgotPassword, onSignInSuccess }: SignInFormProps) => {
	const { handleGoogleLogin, error } = useAuth()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<SignInFormData>({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
		mode: "onChange",
	})

	// TODO: Integrate with API
	const onSubmit = useCallback(
		async (data: SignInFormData) => {
			console.log("Sign in form data:", data)
			// TODO: Call API endpoint for email/password authentication
			// TODO: Handle success/error responses
			// TODO: On successful authentication, trigger OTP verification
			onSignInSuccess(data.email)
		},
		[onSignInSuccess],
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
				<div className="relative mb-8 w-full">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-gray-300 border-t" />
					</div>
					<div className="relative flex justify-center text-base">
						<span className="bg-white px-4 text-default-400">OR</span>
					</div>
				</div>

				<div className="w-full">
					<GoogleLogin
						onSuccess={(credentialResponse) => {
							if (credentialResponse.credential) {
								handleGoogleLogin({ credential: credentialResponse.credential })
							}
						}}
						onError={() => {
							console.error("Google login failed")
						}}
						theme="outline"
						size="large"
						width="340"
					/>
				</div>
			</CardFooter>
		</>
	)
}

export default SignInForm
