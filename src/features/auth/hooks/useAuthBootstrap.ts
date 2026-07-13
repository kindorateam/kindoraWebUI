import { useAtomValue } from "jotai"
import { useEffect } from "react"

import { subscribeToAuthEvents } from "@/services/auth-events.service"
import { redirectToLogin } from "@/services/redirect.service"

import { restoreSession } from "../services/auth.service"
import {
	authInitializedAtom,
	clearAuth,
	clearLegacyAuthStorage,
	expectAuthSession,
	getAuthCredentials,
	mapUserResponse,
	setAuthInitialized,
	setAuthUser,
} from "../stores/auth.store"

export const useAuthBootstrap = () => {
	const isInitialized = useAtomValue(authInitializedAtom)

	useEffect(() => {
		let isActive = true
		clearLegacyAuthStorage()

		const initializeAuth = async () => {
			try {
				const response = await restoreSession()
				if (!isActive) return

				if (response) setAuthUser(mapUserResponse(response))
				else clearAuth()
			} catch {
				if (isActive) clearAuth()
			} finally {
				if (isActive) setAuthInitialized()
			}
		}

		void initializeAuth()
		const unsubscribe = subscribeToAuthEvents(({ event, sessionVersion }) => {
			if (event === "session-ended") {
				if (clearAuth(sessionVersion)) redirectToLogin()
				return
			}

			expectAuthSession(sessionVersion)
			void (async () => {
				let response = await restoreSession()
				if (!response && getAuthCredentials().sessionVersion === sessionVersion) response = await restoreSession()
				if (isActive && response && getAuthCredentials().sessionVersion === sessionVersion) {
					setAuthUser(mapUserResponse(response))
				}
			})()
		})
		return () => {
			isActive = false
			unsubscribe()
		}
	}, [])

	return isInitialized
}
