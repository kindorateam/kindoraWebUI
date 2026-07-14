import { Button, Card, toast } from "@heroui/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"

import { useRequestPasswordReset } from "../hooks/useAuthMutations"

import AuthEmailField from "./AuthEmailField"
import ForgotPasswordConfirmation from "./ForgotPasswordConfirmation"

import type { ForgotPasswordFormData } from "../types"

interface ForgotPasswordFormProps {
	onBack: () => void
	onNext: (email: string, codeSentAt: number) => void
	defaultEmail?: string
}

const ForgotPasswordForm = ({ onBack, onNext, defaultEmail }: ForgotPasswordFormProps) => {
	const { t } = useTranslation()
	const [emailSent, setEmailSent] = useState(false)
	const [submittedEmail, setSubmittedEmail] = useState("")
	const [codeSentAt, setCodeSentAt] = useState<number | null>(null)
	const requestResetMutation = useRequestPasswordReset()

	const {
		control,
		handleSubmit,
		reset,
		formState: { isValid },
	} = useForm<ForgotPasswordFormData>({
		defaultValues: {
			email: defaultEmail || "",
		},
		mode: "onChange",
	})

	useEffect(() => {
		if (defaultEmail) {
			reset({ email: defaultEmail })
		}
	}, [defaultEmail, reset])

	const onSubmit = (data: ForgotPasswordFormData) => {
		requestResetMutation.mutate(data.email, {
			onSuccess: () => {
				const sentAt = Date.now()
				setSubmittedEmail(data.email)
				setCodeSentAt(sentAt)
				setEmailSent(true)
			},
			onError: (error) => {
				toast(t("auth.forgotPassword.sendFailed"), { description: getErrorMessage(error), variant: "danger" })
			},
		})
	}

	const handleNext = () => {
		if (codeSentAt) {
			onNext(submittedEmail, codeSentAt)
		}
	}

	if (emailSent) {
		return <ForgotPasswordConfirmation email={submittedEmail} onNext={handleNext} />
	}

	return (
		<>
			<Card.Header>
				<h1 className="font-semibold text-xl">{t("auth.forgotPassword.title")}</h1>
			</Card.Header>

			<Card.Content className="gap-3">
				<p className="text-default-500 text-sm">{t("auth.forgotPassword.description")}</p>
				<AuthEmailField control={control} name="email" />
			</Card.Content>

			<Card.Footer className="flex-col gap-2">
				<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
					<Button
						fullWidth
						variant="primary"
						isDisabled={!isValid}
						isPending={requestResetMutation.isPending}
						size="lg"
						type="submit"
					>
						{t("common.next")}
					</Button>
				</form>
				<Button fullWidth onPress={onBack} size="lg" variant="outline">
					{t("common.back")}
				</Button>
			</Card.Footer>
		</>
	)
}

export default ForgotPasswordForm
