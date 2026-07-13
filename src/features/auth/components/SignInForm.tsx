import { Button, Card, Checkbox, Link, Separator, toast } from "@heroui/react"
import { GoogleLogin } from "@react-oauth/google"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"
import LogosGoogleIcon from "~icons/logos/google-icon"

import useAuth from "../hooks/useAuth"
import { useGoogleSignIn } from "../hooks/useGoogleSignIn"

import AuthEmailField from "./AuthEmailField"
import AuthPasswordField from "./AuthPasswordField"

import type { CredentialResponse } from "@react-oauth/google"
import type { SignInFormData } from "../types"

interface SignInFormProps {
	onForgotPassword: () => void
	onVerificationRequired?: (email: string, message: string, codeSentAt: number) => void
	defaultEmail?: string
}

interface GoogleSignInButtonProps {
	nonce: string
	onError: () => void
	onSuccess: (response: CredentialResponse) => void
}

const MAX_GOOGLE_BUTTON_WIDTH = 288

const GoogleSignInButton = ({ nonce, onError, onSuccess }: GoogleSignInButtonProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [width, setWidth] = useState(0)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const updateWidth = () => {
			const nextWidth = Math.min(MAX_GOOGLE_BUTTON_WIDTH, Math.floor(container.getBoundingClientRect().width))
			setWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth))
		}

		updateWidth()
		const observer = new ResizeObserver(updateWidth)
		observer.observe(container)

		return () => observer.disconnect()
	}, [])

	return (
		<div className="mx-auto min-h-11 w-full max-w-72" ref={containerRef}>
			{width > 0 && (
				<GoogleLogin
					containerProps={{ className: "flex justify-center" }}
					nonce={nonce}
					onError={onError}
					onSuccess={onSuccess}
					shape="pill"
					size="large"
					text="continue_with"
					theme="outline"
					width={width}
				/>
			)}
		</div>
	)
}

const SignInForm = ({ onForgotPassword, onVerificationRequired, defaultEmail }: SignInFormProps) => {
	const { t } = useTranslation()
	const { emailLoginMutation, isLoading } = useAuth()
	const { loginMutation: googleLoginMutation, nonce, isPreparing, refreshNonce } = useGoogleSignIn()

	const showGoogleError = () => {
		toast(t("auth.signIn.googleFailed"), {
			description: t("auth.signIn.googleFailedDescription"),
			variant: "danger",
		})
	}

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
									<Checkbox.Content>
										<Checkbox.Control>
											<Checkbox.Indicator />
										</Checkbox.Control>
										{t("auth.signIn.rememberMe")}
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

				{nonce && !isLoading && !googleLoginMutation.isPending ? (
					<GoogleSignInButton
						nonce={nonce}
						onError={() => {
							showGoogleError()
							void refreshNonce()
						}}
						onSuccess={(response) => {
							if (!response.credential) {
								showGoogleError()
								void refreshNonce()
								return
							}
							googleLoginMutation.mutate(response.credential, {
								onError: () => {
									showGoogleError()
									void refreshNonce()
								},
							})
						}}
					/>
				) : (
					<Button
						fullWidth
						isDisabled={isLoading || isPreparing || googleLoginMutation.isPending}
						isPending={isPreparing || googleLoginMutation.isPending}
						onPress={() => void refreshNonce()}
						variant="outline"
					>
						<LogosGoogleIcon /> {t("auth.signIn.google")}
					</Button>
				)}
			</Card.Footer>
		</>
	)
}

export default SignInForm
