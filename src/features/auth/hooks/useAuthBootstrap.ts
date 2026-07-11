import { useAtomValue } from "jotai"
import { useEffect } from "react"

import { subscribeToAuthEvents } from "@/services/auth-events.service"
import { redirectToLogin } from "@/services/redirect.service"

import { restoreSession } from "../services/auth.service"
import {
	authInitializedAtom,
	clearAuth,
	clearLegacyAuthStorage,
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
		const unsubscribe = subscribeToAuthEvents((event) => {
			if (event === "session-ended") {
				clearAuth()
				redirectToLogin()
				return
			}

			void restoreSession().then((response) => {
				if (isActive && response) setAuthUser(mapUserResponse(response))
			})
		})
		return () => {
			isActive = false
			unsubscribe()
		}
	}, [])

	return isInitialized
}
