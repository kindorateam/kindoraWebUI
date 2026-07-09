import { getSafeInternalReturnUrl } from "./redirect.service"

import { describe, expect, test } from "bun:test"

const ORIGIN = "https://localhost:5173"

describe("getSafeInternalReturnUrl", () => {
	test("keeps internal paths with search and hash", () => {
		expect(getSafeInternalReturnUrl("/students/123?tab=profile#details", ORIGIN)).toBe(
			"/students/123?tab=profile#details",
		)
	})

	test("rejects external and protocol-relative URLs", () => {
		expect(getSafeInternalReturnUrl("https://example.com", ORIGIN)).toBeNull()
		expect(getSafeInternalReturnUrl("//example.com/path", ORIGIN)).toBeNull()
	})

	test("rejects login loops and non-path values", () => {
		expect(getSafeInternalReturnUrl("/login?redirect=/dashboard", ORIGIN)).toBeNull()
		expect(getSafeInternalReturnUrl("dashboard", ORIGIN)).toBeNull()
	})
})
