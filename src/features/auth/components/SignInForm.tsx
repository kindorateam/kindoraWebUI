import { Button, Card, Checkbox, Label, Link, Separator, toast } from "@heroui/react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"
import LogosGoogleIcon from "~icons/logos/google-icon"

import useAuth from "../hooks/useAuth"

import AuthEmailField from "./AuthEmailField"
import AuthPasswordField from "./AuthPasswordField"

import type { SignInFormData } from "../types"

interface SignInFormProps {
	onForgotPassword: () => void
	onVerificationRequired?: (email: string, message: string, codeSentAt: number) => void
	defaultEmail?: string
}

const SignInForm = ({ onForgotPassword, onVerificationRequired, defaultEmail }: SignInFormProps) => {
	const { t } = useTranslation()
	const { handleGoogleLogin, emailLoginMutation, isLoading } = useAuth()

	const {
		control,
		handleSubmit,
		formState: { isValid },
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
					toast(t("auth.signIn.loginFailed"), { description: getErrorMessage(error), variant: "danger" })
				},
			},
		)
	}

	return (
		<>
			<Card.Header>
				<h1 className="font-semibold text-xl">{t("auth.signIn.title")}</h1>
			</Card.Header>

			<Card.Content className="gap-4">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4 flex flex-col gap-3">
						<AuthEmailField control={control} name="email" />
						<AuthPasswordField
							control={control}
							label={t("auth.fields.password")}
							name="password"
							placeholder={t("auth.placeholders.password")}
							requiredMessage={t("auth.validation.passwordRequired")}
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
										<Label>{t("auth.signIn.rememberMe")}</Label>
									</Checkbox.Content>
								</Checkbox>
							)}
						/>
						<Link onPress={onForgotPassword}>{t("auth.signIn.forgotPassword")}</Link>
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
						{t("auth.signIn.submit")}
					</Button>
				</form>
			</Card.Content>
			<Card.Footer className="flex-col gap-4">
				<div className="flex items-center gap-4">
					<Separator className="flex-1" />
					<span className="text-default-400 text-sm">{t("auth.signIn.or")}</span>
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
					<LogosGoogleIcon /> {t("auth.signIn.google")}
				</Button>
			</Card.Footer>
		</>
	)
}

export default SignInForm
