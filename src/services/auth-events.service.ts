const AUTH_CHANNEL = "kindora-auth"
const TAB_ID = crypto.randomUUID()

export type AuthEvent = "session-ended" | "session-started"

interface AuthEventMessage {
	event: AuthEvent
	sourceId: string
}

const isAuthEventMessage = (value: unknown): value is AuthEventMessage => {
	if (typeof value !== "object" || value === null) return false
	const candidate = value as Partial<AuthEventMessage>
	return (
		(candidate.event === "session-ended" || candidate.event === "session-started") &&
		typeof candidate.sourceId === "string"
	)
}

export const publishAuthEvent = (event: AuthEvent): void => {
	if (typeof BroadcastChannel === "undefined") return
	const channel = new BroadcastChannel(AUTH_CHANNEL)
	channel.postMessage({ event, sourceId: TAB_ID } satisfies AuthEventMessage)
	channel.close()
}

export const subscribeToAuthEvents = (listener: (event: AuthEvent) => void): (() => void) => {
	if (typeof BroadcastChannel === "undefined") return () => undefined

	const channel = new BroadcastChannel(AUTH_CHANNEL)
	channel.onmessage = ({ data }: MessageEvent<unknown>) => {
		if (isAuthEventMessage(data) && data.sourceId !== TAB_ID) listener(data.event)
	}
	return () => channel.close()
}
