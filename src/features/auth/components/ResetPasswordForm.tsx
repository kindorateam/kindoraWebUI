import { Button, CardBody, CardFooter, CardHeader, Input } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useCallback, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { resetPassword } from "@/services/auth.service"

import ResetPasswordConfirmation from "./ResetPasswordConfirmation"

import type { ResetPasswordFormData } from "../types"

interface ResetPasswordFormProps {
	email: string
	token: string
	onBack: () => void
	onResetSuccess: () => void
}

type StrengthLabel = "weak" | "fair" | "good" | "strong"

const passwordRequirements = [
	{
		id: "length",
		label: "At least 8 characters long",
		test: (value: string) => value.length >= 8,
	},
	{
		id: "lowercase",
		label: "One lowercase character",
		test: (value: string) => /[a-z]/.test(value),
	},
	{
		id: "uppercase",
		label: "One uppercase character",
		test: (value: string) => /[A-Z]/.test(value),
	},
	{
		id: "numberOrSymbol",
		label: "One number or symbol",
		test: (value: string) => /[\d\W_]/.test(value),
	},
]

const barColorMap: Record<StrengthLabel | "empty", string> = {
	weak: "bg-rose-500",
	fair: "bg-amber-400",
	good: "bg-lime-400",
	strong: "bg-emerald-500",
	empty: "bg-default-200",
}

const strengthColorMap: Record<StrengthLabel | "empty", string> = {
	weak: "text-danger",
	fair: "text-warning",
	good: "text-success",
	strong: "text-success",
	empty: "text-default-400",
}

const ResetPasswordForm = ({ email, token, onBack, onResetSuccess }: ResetPasswordFormProps) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
	const [resetComplete, setResetComplete] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const formId = "reset-password-form"

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting, isValid },
	} = useForm<ResetPasswordFormData>({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	})

	const passwordValue = watch("password")

	const requirementStatuses = useMemo(
		() =>
			passwordRequirements.map((requirement) => ({
				...requirement,
				isMet: requirement.test(passwordValue),
			})),
		[passwordValue],
	)

	const completedRequirements = requirementStatuses.filter((requirement) => requirement.isMet).length

	const strength = useMemo(() => {
		if (!passwordValue) {
			return {
				label: "weak",
				barsFilled: 0,
				colorClass: strengthColorMap.empty,
				barColorClass: barColorMap.empty,
			}
		}

		if (completedRequirements <= 1) {
			return {
				label: "weak",
				barsFilled: 1,
				colorClass: strengthColorMap.weak,
				barColorClass: barColorMap.weak,
			}
		}

		if (completedRequirements === 2) {
			return {
				label: "fair",
				barsFilled: 2,
				colorClass: strengthColorMap.fair,
				barColorClass: barColorMap.fair,
			}
		}

		if (completedRequirements === 3) {
			return {
				label: "good",
				barsFilled: 3,
				colorClass: strengthColorMap.good,
				barColorClass: barColorMap.good,
			}
		}

		return {
			label: "strong",
			barsFilled: 4,
			colorClass: strengthColorMap.strong,
			barColorClass: barColorMap.strong,
		}
	}, [completedRequirements, passwordValue])

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
				<form className="flex flex-col gap-8" id={formId} onSubmit={handleSubmit(onSubmit)}>
					{error && <div className="rounded-md bg-danger-50 p-3 text-danger text-sm">{error}</div>}

					<div className="flex flex-col gap-3">
						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<Input
									{...field}
									endContent={
										<VisibilityToggleButton
											fieldLabel="password"
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
										<VisibilityToggleButton
											fieldLabel="confirmation password"
											isVisible={isConfirmPasswordVisible}
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
								validate: (value) => value === passwordValue || "Passwords do not match",
							}}
						/>
					</div>

					<div className="flex items-center gap-8">
						<div className="flex items-center gap-1 text-sm leading-5">
							<p className="text-foreground">Strength:</p>
							<span className={`capitalize ${strength.colorClass}`}>{strength.label}</span>
						</div>
						<div className="flex flex-1 items-center gap-2">
							{Array.from({ length: 4 }).map((_, index) => (
								<div
									className={`h-1 flex-1 rounded-xl ${
										index < strength.barsFilled ? strength.barColorClass : barColorMap.empty
									}`}
									key={`strength-bar-${index}`}
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
									{requirement.isMet && <CheckIcon />}
								</span>
								<p className="text-default-600 text-sm">{requirement.label}</p>
							</div>
						))}
					</div>
				</form>
			</CardBody>

			<CardFooter className="flex-col gap-3 px-7 pt-6 pb-8">
				<Button
					className="h-10 w-full"
					color="primary"
					form={formId}
					isDisabled={!isValid}
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

interface VisibilityToggleButtonProps {
	fieldLabel: string
	isVisible: boolean
	onToggle: () => void
	visibleIcon?: string
	hiddenIcon?: string
}

const VisibilityToggleButton = ({
	fieldLabel,
	isVisible,
	onToggle,
	visibleIcon = "tabler:eye",
	hiddenIcon = "tabler:eye-closed",
}: VisibilityToggleButtonProps) => {
	const ariaLabel = `${isVisible ? "Hide" : "Show"} ${fieldLabel}`

	return (
		<button
			aria-label={ariaLabel}
			className="text-default-500"
			onMouseDown={(event) => event.preventDefault()}
			onClick={() => onToggle()}
			type="button"
		>
			<Icon icon={isVisible ? visibleIcon : hiddenIcon} height="20" width="20" />
		</button>
	)
}

const CheckIcon = () => {
	return (
		<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 16 16">
			<path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}
