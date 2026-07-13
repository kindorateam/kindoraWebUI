import { clearAuth, expectAuthSession, getAuthCredentials, setAuthCredentials } from "./auth.store"

import { afterEach, describe, expect, it } from "bun:test"

const SESSION = {
	accessToken: "access-token",
	expiresAt: "2026-07-13T12:00:00.000Z",
	role: "manager",
	sessionVersion: "current-session",
}

describe("auth credentials", () => {
	afterEach(() => clearAuth())

	it("keeps access credentials in memory and ignores stale session cleanup", () => {
		setAuthCredentials(SESSION)

		expect(clearAuth("older-session")).toBe(false)
		expect(getAuthCredentials()).toEqual(SESSION)
		expect(clearAuth(SESSION.sessionVersion)).toBe(true)
		expect(getAuthCredentials().accessToken).toBeNull()
	})

	it("can reserve a new cross-tab session version without copying credentials", () => {
		setAuthCredentials(SESSION)
		expectAuthSession("new-session")

		expect(getAuthCredentials()).toEqual({
			accessToken: null,
			expiresAt: null,
			role: null,
			sessionVersion: "new-session",
		})
	})
})
