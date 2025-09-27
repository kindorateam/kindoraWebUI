import { Button } from "@heroui/react"

import AlertCircleIcon from "@/components/icons/AlertCircleIcon"
import HomeIcon from "@/components/icons/HomeIcon"
import RefreshIcon from "@/components/icons/RefreshIcon"
import { getErrorMessage, getUserMessage } from "@/utils/error"

import type { ErrorFallbackProps } from "@/types/error"

const ErrorFallback = ({ error, resetError, errorInfo }: ErrorFallbackProps) => {
	const isDev = import.meta.env.DEV

	const handleGoHome = () => {
		window.location.href = "/"
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
				<div className="flex flex-col items-center text-center">
					<div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
						<AlertCircleIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
					</div>

					<h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Oops! Something went wrong</h1>

					<p className="mb-6 text-gray-600 dark:text-gray-400">{getUserMessage(error)}</p>

					{isDev && (
						<details className="mb-6 w-full text-left">
							<summary className="mb-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
								Error Details (Development Only)
							</summary>
							<div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
								<div>
									<p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Error Message:</p>
									<p className="font-mono text-sm text-gray-700 dark:text-gray-300">{getErrorMessage(error)}</p>
								</div>
								{errorInfo?.componentStack && (
									<div>
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Component Stack:</p>
										<pre className="overflow-x-auto text-xs text-gray-700 dark:text-gray-300">
											{errorInfo.componentStack}
										</pre>
									</div>
								)}
								{error.stack && (
									<div>
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Stack Trace:</p>
										<pre className="overflow-x-auto text-xs text-gray-700 dark:text-gray-300">{error.stack}</pre>
									</div>
								)}
							</div>
						</details>
					)}

					<div className="flex w-full gap-3">
						<Button
							className="flex-1"
							color="primary"
							onPress={resetError}
							startContent={<RefreshIcon className="h-4 w-4" />}
							variant="flat"
						>
							Try Again
						</Button>
						<Button
							className="flex-1"
							color="primary"
							onPress={handleGoHome}
							startContent={<HomeIcon className="h-4 w-4" />}
						>
							Go Home
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ErrorFallback
