import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"

import {
	createMessageSocketTicket,
	markConversationRead,
	openMessageSocket,
	parseMessageSocketFrame,
} from "../services/message.service"

import { applyMessageToCache } from "./useMessageQueries"

import type { MessageConnectionState } from "../types"

const RECONNECT_DELAY_MS = 3000
const MAX_RECONNECT_DELAY_MS = 30000

interface UseMessageSocketOptions {
	selectedConversationId?: string
	userId?: string
}

export const useMessageSocket = ({ selectedConversationId, userId }: UseMessageSocketOptions) => {
	const queryClient = useQueryClient()
	const [connection, setConnection] = useState<MessageConnectionState>({ status: "connecting" })
	const [socketAttempt, setSocketAttempt] = useState(0)
	const selectedConversationIdRef = useRef(selectedConversationId)

	selectedConversationIdRef.current = selectedConversationId

	useEffect(() => {
		let isActive = true
		let reconnectTimer: number | undefined
		let socket: WebSocket | undefined
		setConnection({ status: socketAttempt === 0 ? "connecting" : "reconnecting" })

		const connect = async () => {
			try {
				const { ticket } = await createMessageSocketTicket()
				if (!isActive) return

				socket = openMessageSocket(ticket)
				socket.onopen = () => {
					if (isActive) setConnection({ status: "connected" })
				}
				socket.onmessage = (event) => {
					const frame = parseMessageSocketFrame(event.data)
					if (!frame) return

					applyMessageToCache(queryClient, frame.message, {
						selectedConversationId: selectedConversationIdRef.current,
						userId,
					})
					if (selectedConversationIdRef.current === frame.conversationId && frame.message.senderId !== userId) {
						void markConversationRead(frame.conversationId)
					}
				}
				socket.onerror = () => {
					if (isActive) setConnection({ status: "error" })
				}
				socket.onclose = () => {
					if (!isActive) return
					setConnection({ status: "disconnected" })
					const reconnectDelay = Math.min(RECONNECT_DELAY_MS * 2 ** Math.min(socketAttempt, 4), MAX_RECONNECT_DELAY_MS)
					reconnectTimer = window.setTimeout(() => setSocketAttempt((attempt) => attempt + 1), reconnectDelay)
				}
			} catch {
				if (!isActive) return
				setConnection({ status: "error" })
				const reconnectDelay = Math.min(RECONNECT_DELAY_MS * 2 ** Math.min(socketAttempt, 4), MAX_RECONNECT_DELAY_MS)
				reconnectTimer = window.setTimeout(() => setSocketAttempt((attempt) => attempt + 1), reconnectDelay)
			}
		}

		void connect()

		return () => {
			isActive = false
			if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer)
			socket?.close()
		}
	}, [queryClient, socketAttempt, userId])

	return {
		connection,
		reconnect: () => setSocketAttempt((attempt) => attempt + 1),
	}
}
