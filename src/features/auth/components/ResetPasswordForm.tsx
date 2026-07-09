import { Button, Card, toast } from "@heroui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"
import TablerCheck from "~icons/tabler/check"

import { barColorMap } from "../constants"
import { useResetPassword } from "../hooks/useAuthMutations"
import { areRequiredRequirementsMet, calculatePasswordStrength, getRequirementStatuses } from "../utils/password"

import AuthPasswordField from "./AuthPasswordField"
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
	const { t } = useTranslation()
	const [resetComplete, setResetComplete] = useState(false)
	const resetPasswordMutation = useResetPassword()

	const { control, handleSubmit, watch } = useForm<ResetPasswordFormData>({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	})

	const passwordValue = watch("password")
	const confirmPasswordValue = watch("confirmPassword")

	const requirementStatuses = getRequirementStatuses(passwordValue)

	const strength = calculatePasswordStrength(passwordValue)

	const canSubmit =
		areRequiredRequirementsMet(passwordValue) &&
		confirmPasswordValue === passwordValue &&
		confirmPasswordValue.length > 0

	const onSubmit = (data: ResetPasswordFormData) => {
		resetPasswordMutation.mutate(
			{ email, code: token, newPassword: data.password },
			{
				onSuccess: () => setResetComplete(true),
				onError: (error) => {
					toast(t("auth.resetPassword.failed"), { description: getErrorMessage(error), variant: "danger" })
				},
			},
		)
	}

	if (resetComplete) {
		return <ResetPasswordConfirmation onBackToSignIn={onResetSuccess} />
	}

	return (
		<>
			<Card.Header>
				<h1 className="font-medium text-xl">{t("auth.resetPassword.title")}</h1>
			</Card.Header>

			<Card.Content>
				<form className="flex flex-col gap-5" id={formId} onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-3">
						<AuthPasswordField
							control={control}
							label={t("auth.fields.newPassword")}
							name="password"
							placeholder={t("auth.placeholders.password")}
							requiredMessage={t("auth.validation.passwordRequired")}
						/>

						<AuthPasswordField
							control={control}
							label={t("auth.fields.confirmPassword")}
							name="confirmPassword"
							placeholder={t("auth.placeholders.confirmPassword")}
							requiredMessage={t("auth.validation.confirmPasswordRequired")}
							validate={(value) => value === passwordValue || t("auth.validation.passwordMismatch")}
						/>
					</div>

					<div className="flex items-center gap-8">
						<div className="flex min-w-44 items-center gap-1 text-sm">
							<p className="text-foreground">{t("auth.resetPassword.strength")}</p>
							<span className={strength.barsFilled > 0 ? strength.colorClass : "text-default-400"}>
								{strength.barsFilled > 0 ? strength.displayLabel : t("auth.resetPassword.none")}
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
								<p className="text-default-500 text-sm">{requirement.label}</p>
							</div>
						))}
					</div>
				</form>
			</Card.Content>

			<Card.Footer className="flex-col gap-3">
				<Button
					fullWidth
					variant="primary"
					form={formId}
					isDisabled={!canSubmit}
					isPending={resetPasswordMutation.isPending}
					type="submit"
				>
					{t("auth.resetPassword.submit")}
				</Button>
				<Button fullWidth onPress={onBack} variant="outline">
					{t("common.back")}
				</Button>
			</Card.Footer>
		</>
	)
}

export default ResetPasswordForm
