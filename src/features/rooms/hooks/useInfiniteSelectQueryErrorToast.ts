import { toast } from "@heroui/react"
import { useEffect, useRef } from "react"

import { getErrorMessage } from "@/utils/error"

interface UseInfiniteSelectQueryErrorToastOptions {
	error: unknown
	isEnabled: boolean
	isError: boolean
	isFetchNextPageError: boolean
	title: string
}

export const useInfiniteSelectQueryErrorToast = ({
	error,
	isEnabled,
	isError,
	isFetchNextPageError,
	title,
}: UseInfiniteSelectQueryErrorToastOptions) => {
	const errorToastShownRef = useRef(false)
	const hasFetchError = Boolean(error) && (isError || isFetchNextPageError)

	useEffect(() => {
		if (!isEnabled || !hasFetchError || errorToastShownRef.current) return

		toast(title, {
			description: getErrorMessage(error),
			variant: "danger",
		})

		errorToastShownRef.current = true
	}, [error, hasFetchError, isEnabled, title])

	useEffect(() => {
		if (!isEnabled || !hasFetchError) {
			errorToastShownRef.current = false
		}
	}, [hasFetchError, isEnabled])
}
