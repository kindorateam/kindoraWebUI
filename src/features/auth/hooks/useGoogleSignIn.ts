import { useQuery } from "@tanstack/react-query"

import { createGoogleLoginNonce } from "../services/auth.service"

import { useGoogleLoginMutation } from "./useAuthMutations"

const GOOGLE_NONCE_REFRESH_SAFETY_MS = 60 * 1000
const GOOGLE_NONCE_MIN_REFRESH_MS = 10 * 1000

export const useGoogleSignIn = () => {
	const nonceQuery = useQuery({
		queryKey: ["auth", "google-login-nonce"],
		queryFn: createGoogleLoginNonce,
		refetchInterval: (query) => {
			const expiresAt = query.state.data?.expiresAt
			if (!expiresAt) return false
			return Math.max(GOOGLE_NONCE_MIN_REFRESH_MS, Date.parse(expiresAt) - Date.now() - GOOGLE_NONCE_REFRESH_SAFETY_MS)
		},
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false,
		retry: 1,
	})
	const loginMutation = useGoogleLoginMutation()

	return {
		loginMutation,
		nonce: nonceQuery.data?.nonce,
		isPreparing: nonceQuery.isPending || nonceQuery.isFetching,
		refreshNonce: nonceQuery.refetch,
	}
}
