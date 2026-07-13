const AUTH_CHANNEL = "kindora-auth"
const TAB_ID = crypto.randomUUID()

export type AuthEvent = "session-ended" | "session-started"

export interface AuthEventMessage {
	event: AuthEvent
	sessionVersion: string
	sourceId: string
}

const isAuthEventMessage = (value: unknown): value is AuthEventMessage => {
	if (typeof value !== "object" || value === null) return false
	const candidate = value as Partial<AuthEventMessage>
	return (
		(candidate.event === "session-ended" || candidate.event === "session-started") &&
		typeof candidate.sessionVersion === "string" &&
		candidate.sessionVersion.length > 0 &&
		typeof candidate.sourceId === "string"
	)
}

export const publishAuthEvent = (event: AuthEvent, sessionVersion: string): void => {
	if (typeof BroadcastChannel === "undefined") return
	const channel = new BroadcastChannel(AUTH_CHANNEL)
	channel.postMessage({ event, sessionVersion, sourceId: TAB_ID } satisfies AuthEventMessage)
	channel.close()
}

export const subscribeToAuthEvents = (listener: (message: AuthEventMessage) => void): (() => void) => {
	if (typeof BroadcastChannel === "undefined") return () => undefined

	const channel = new BroadcastChannel(AUTH_CHANNEL)
	channel.onmessage = ({ data }: MessageEvent<unknown>) => {
		if (isAuthEventMessage(data) && data.sourceId !== TAB_ID) listener(data)
	}
	return () => channel.close()
}
