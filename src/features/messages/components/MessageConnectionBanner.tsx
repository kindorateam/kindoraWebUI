import { Button } from "@heroui/react"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

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
		descriptionKey: string
		icon: React.ReactNode
		titleKey: string
		variantClassName: string
	}
> = {
	connecting: {
		descriptionKey: "messages.connection.connectingDescription",
		icon: <MdiCloudRefreshOutline className="size-5 shrink-0" />,
		titleKey: "messages.connection.connecting",
		variantClassName: "border-warning-soft bg-warning-soft text-warning-soft-foreground",
	},
	disconnected: {
		actionLabel: "messages.connection.reconnect",
		descriptionKey: "messages.connection.disconnectedDescription",
		icon: <MdiWifiOff className="size-5 shrink-0" />,
		titleKey: "messages.connection.disconnected",
		variantClassName: "border-danger-soft bg-danger-soft text-danger-soft-foreground",
	},
	error: {
		actionLabel: "messages.connection.retry",
		descriptionKey: "messages.connection.errorDescription",
		icon: <MdiAlertCircleOutline className="size-5 shrink-0" />,
		titleKey: "messages.connection.error",
		variantClassName: "border-danger-soft bg-danger-soft text-danger-soft-foreground",
	},
	reconnecting: {
		descriptionKey: "messages.connection.reconnectingDescription",
		icon: <MdiCloudRefreshOutline className="size-5 shrink-0" />,
		titleKey: "messages.connection.reconnecting",
		variantClassName: "border-warning-soft bg-warning-soft text-warning-soft-foreground",
	},
}

const MessageConnectionBanner = ({ connection, onReconnect }: MessageConnectionBannerProps) => {
	const { t } = useTranslation()

	if (connection.status === "connected") return null

	const copy = CONNECTION_COPY[connection.status]

	return (
		<div
			className={clsx(
				"mx-3 mt-3 flex items-start gap-3 rounded-lg border px-3 py-2 sm:mx-4 sm:mt-4",
				copy.variantClassName,
			)}
		>
			{copy.icon}
			<div className="min-w-0 flex-1">
				<p className="font-medium text-sm leading-5">{t(copy.titleKey)}</p>
				<p className="text-xs leading-5">{connection.errorMessage ?? t(copy.descriptionKey)}</p>
			</div>
			{copy.actionLabel ? (
				<Button className="shrink-0" size="sm" variant="secondary" onPress={onReconnect}>
					{t(copy.actionLabel)}
				</Button>
			) : null}
		</div>
	)
}

export default MessageConnectionBanner
