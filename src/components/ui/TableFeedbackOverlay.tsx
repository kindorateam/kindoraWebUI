import { EmptyState, Spinner } from "@heroui/react"

import TableError from "@/components/TableError"

interface TableFeedbackOverlayProps {
	emptyMessage: string
	hasError: boolean
	isEmpty: boolean
	isLoading: boolean
	onRetry: () => void
}

const TableFeedbackOverlay = ({ emptyMessage, hasError, isEmpty, isLoading, onRetry }: TableFeedbackOverlayProps) => {
	if (isLoading) {
		return (
			<div className="pointer-events-none absolute inset-x-0 top-12.5 bottom-0 flex items-center justify-center rounded-[calc(var(--radius)*2)] bg-white">
				<Spinner />
			</div>
		)
	}

	if (hasError) {
		return (
			<div className="absolute inset-x-0 top-12.5 bottom-0 rounded-[calc(var(--radius)*2)] bg-white">
				<div className="flex h-full items-center justify-center px-4 py-8">
					<TableError onRetry={onRetry} />
				</div>
			</div>
		)
	}

	if (isEmpty) {
		return (
			<div className="absolute inset-x-0 top-12.5 bottom-0 rounded-[calc(var(--radius)*2)] bg-white">
				<EmptyState className="flex h-full w-full items-center justify-center text-default-400">
					{emptyMessage}
				</EmptyState>
			</div>
		)
	}

	return null
}

export default TableFeedbackOverlay
