import { Button } from "@heroui/react"

import { getUserMessage } from "@/utils/error"
import MdiAlertOutline from "~icons/mdi/alert-outline"

import type { ErrorFallbackProps } from "@/types/error"

const CompactErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
	return (
		<div className="flex flex-col items-center justify-center p-8 text-center">
			<MdiAlertOutline className="mb-4 h-12 w-12 text-warning" />
			<h3 className="mb-2 font-semibold text-lg">Something went wrong</h3>
			<p className="mb-4 text-gray-600 text-sm dark:text-gray-400">{getUserMessage(error)}</p>
			<Button variant="secondary" onPress={resetError} size="sm">
				Try Again
			</Button>
		</div>
	)
}

export default CompactErrorFallback
