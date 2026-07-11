import { publishAuthEvent, subscribeToAuthEvents } from "./auth-events.service"

import { describe, expect, it } from "bun:test"

const AUTH_CHANNEL = "kindora-auth"

describe("auth events", () => {
	it("ignores events published by the current tab", async () => {
		let received = false
		const unsubscribe = subscribeToAuthEvents(() => {
			received = true
		})

		publishAuthEvent("session-started")
		await Bun.sleep(25)

		unsubscribe()
		expect(received).toBe(false)
	})

	it("delivers events published by another tab", async () => {
		const event = new Promise<string>((resolve) => {
			const unsubscribe = subscribeToAuthEvents((receivedEvent) => {
				unsubscribe()
				resolve(receivedEvent)
			})
		})
		const externalTab = new BroadcastChannel(AUTH_CHANNEL)
		externalTab.postMessage({ event: "session-ended", sourceId: "another-tab" })

		expect(await event).toBe("session-ended")
		externalTab.close()
	})
})
