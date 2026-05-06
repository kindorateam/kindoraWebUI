import { Button } from "@heroui/react"
import clsx from "clsx"

import MdiAlertCircleOutline from "~icons/mdi/alert-circle-outline"
import MdiCloudRefreshOutline from "~icons/mdi/cloud-refresh-outline"
import MdiWifiOff from "~icons/mdi/wifi-off"

import type { MessageConnectionState } from "../types"

interface MessageConnectionBannerProps {
	connection: MessageConnectionState
	onReconnect: () => void
}

const CONNECTION_COPY: Record<
	Exclude<MessageConnectionState["status"], "connected">,
	{
		actionLabel?: string
		description: string
		icon: React.ReactNode
		title: string
		variantClassName: string
	}
> = {
	connecting: {
		description: "Opening the live message connection.",
		icon: <MdiCloudRefreshOutline className="size-5 shrink-0" />,
		title: "Connecting to messages",
		variantClassName: "border-warning-soft bg-warning-soft text-warning-soft-foreground",
	},
	disconnected: {
		actionLabel: "Reconnect",
		description: "Messages may be delayed until the connection is restored.",
		icon: <MdiWifiOff className="size-5 shrink-0" />,
		title: "Messages disconnected",
		variantClassName: "border-danger-soft bg-danger-soft text-danger-soft-foreground",
	},
	error: {
		actionLabel: "Retry",
		description: "We could not keep the live message connection open.",
		icon: <MdiAlertCircleOutline className="size-5 shrink-0" />,
		title: "Message connection failed",
		variantClassName: "border-danger-soft bg-danger-soft text-danger-soft-foreground",
	},
	reconnecting: {
		description: "Trying to restore the live message connection.",
		icon: <MdiCloudRefreshOutline className="size-5 shrink-0" />,
		title: "Reconnecting to messages",
		variantClassName: "border-warning-soft bg-warning-soft text-warning-soft-foreground",
	},
}

const MessageConnectionBanner = ({ connection, onReconnect }: MessageConnectionBannerProps) => {
	if (connection.status === "connected") return null

	const copy = CONNECTION_COPY[connection.status]

	return (
		<div className={clsx("mx-4 mt-4 flex items-start gap-3 rounded-lg border px-3 py-2", copy.variantClassName)}>
			{copy.icon}
			<div className="min-w-0 flex-1">
				<p className="font-medium text-sm leading-5">{copy.title}</p>
				<p className="text-xs leading-5">{connection.errorMessage ?? copy.description}</p>
			</div>
			{copy.actionLabel ? (
				<Button className="shrink-0" size="sm" variant="secondary" onPress={onReconnect}>
					{copy.actionLabel}
				</Button>
			) : null}
		</div>
	)
}

export default MessageConnectionBanner
