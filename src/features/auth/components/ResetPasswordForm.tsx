import { Button, CardBody, CardFooter, CardHeader, Input } from "@heroui/react"
import { useCallback, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import TablerCheck from "~icons/tabler/check"

import { barColorMap } from "../constants"
import { resetPassword } from "../services/auth.service"
import { areRequiredRequirementsMet, calculatePasswordStrength, getRequirementStatuses } from "../utils/password"

import PasswordVisibilityToggle from "./PasswordVisibilityToggle"
import ResetPasswordConfirmation from "./ResetPasswordConfirmation"

import type { ResetPasswordFormData } from "../types"

interface ResetPasswordFormProps {
	email: string
	token: string
	onBack: () => void
	onResetSuccess: () => void
}

const formId = "reset-password-form"

const ResetPasswordForm = ({ email, token, onBack, onResetSuccess }: ResetPasswordFormProps) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
	const [resetComplete, setResetComplete] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordFormData>({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	})

	const passwordValue = watch("password")
	const confirmPasswordValue = watch("confirmPassword")

	const requirementStatuses = useMemo(() => getRequirementStatuses(passwordValue), [passwordValue])

	const strength = useMemo(() => calculatePasswordStrength(passwordValue), [passwordValue])

	const canSubmit = useMemo(() => {
		return (
			areRequiredRequirementsMet(passwordValue) &&
			confirmPasswordValue === passwordValue &&
			confirmPasswordValue.length > 0
		)
	}, [passwordValue, confirmPasswordValue])

	const onSubmit = useCallback(
		async (data: ResetPasswordFormData) => {
			try {
				setError(null)
				await resetPassword(email, token, data.password)
				setResetComplete(true)
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.")
			}
		},
		[email, token],
	)

	if (resetComplete) {
		return <ResetPasswordConfirmation onBackToSignIn={onResetSuccess} />
	}

	return (
		<>
			<CardHeader className="px-7 pt-8 pb-4">
				<h1 className="font-medium text-xl leading-7">Create a new password</h1>
			</CardHeader>

			<CardBody className="px-7 pt-4 pb-0">
				<form className="flex flex-col gap-5" id={formId} onSubmit={handleSubmit(onSubmit)}>
					{error && <div className="rounded-md bg-danger-50 p-3 text-danger text-sm">{error}</div>}

					<div className="flex flex-col gap-3">
						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<Input
									{...field}
									endContent={
										<PasswordVisibilityToggle
											isVisible={isPasswordVisible}
											onToggle={() => setIsPasswordVisible((prev) => !prev)}
										/>
									}
									errorMessage={errors.password?.message}
									isInvalid={!!errors.password}
									isRequired
									label="Create a password"
									labelPlacement="inside"
									placeholder="Enter your password"
									radius="lg"
									size="md"
									type={isPasswordVisible ? "text" : "password"}
									variant="flat"
								/>
							)}
							rules={{
								required: "Password is required",
							}}
						/>

						<Controller
							control={control}
							name="confirmPassword"
							render={({ field }) => (
								<Input
									{...field}
									endContent={
										<PasswordVisibilityToggle
											isVisible={isConfirmPasswordVisible}
											label="confirmation password"
											onToggle={() => setIsConfirmPasswordVisible((prev) => !prev)}
										/>
									}
									errorMessage={errors.confirmPassword?.message}
									isInvalid={!!errors.confirmPassword}
									isRequired
									label="Confirm your password"
									labelPlacement="inside"
									placeholder="Re-enter your password"
									radius="lg"
									size="md"
									type={isConfirmPasswordVisible ? "text" : "password"}
									variant="flat"
								/>
							)}
							rules={{
								required: "Please confirm your password",
								validate: (value) =>
									value === passwordValue || "The passwords you entered don't match. Please try again.",
							}}
						/>
					</div>

					<div className="flex items-center gap-8">
						<div className="flex min-w-44 items-center gap-1 text-sm leading-5">
							<p className="text-foreground">Strength:</p>
							<span className={strength.barsFilled > 0 ? strength.colorClass : "text-default-400"}>
								{strength.barsFilled > 0 ? strength.displayLabel : "None"}
							</span>
						</div>
						<div className="flex flex-1 items-center gap-2">
							{[0, 1, 2, 3, 4].map((barIndex) => (
								<div
									className={`h-1 flex-1 rounded-xl ${
										barIndex < strength.barsFilled ? strength.barColorClass : barColorMap.empty
									}`}
									key={`strength-bar-${barIndex}`}
								/>
							))}
						</div>
					</div>

					<div className="flex flex-col">
						{requirementStatuses.map((requirement) => (
							<div className="flex items-center gap-2 p-2" key={requirement.id}>
								<span
									className={`flex size-4 items-center justify-center rounded-lg border-2 ${
										requirement.isMet ? "border-success bg-success" : "border-default bg-default"
									}`}
								>
									<TablerCheck className={`size-3 ${requirement.isMet ? "text-white" : "text-black"}`} />
								</span>
								<p className="text-default-600 text-sm">{requirement.label}</p>
							</div>
						))}
					</div>
				</form>
			</CardBody>

			<CardFooter className="flex-col gap-3 px-7 pt-5 pb-8">
				<Button
					className="h-10 w-full"
					color="primary"
					form={formId}
					isDisabled={!canSubmit}
					isLoading={isSubmitting}
					radius="lg"
					type="submit"
				>
					Reset password
				</Button>
				<Button className="h-10 w-full" onPress={onBack} radius="lg" variant="bordered">
					Back
				</Button>
			</CardFooter>
		</>
	)
}

export default ResetPasswordForm
