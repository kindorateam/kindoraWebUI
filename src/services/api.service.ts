import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios"

import { clearAuth, getAuthCredentials, setAuthCredentials } from "@/features/auth/stores/auth.store"
import { publishAuthEvent } from "@/services/auth-events.service"
import { redirectToLogin } from "@/services/redirect.service"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1"
const API_TIMEOUT = 30000
const AUTH_REFRESH_LOCK = "kindora-auth-refresh"
const isAuthEndpoint = (url?: string): boolean => url?.includes("/auth/") ?? false

export interface AccessSessionResponse {
	accessToken: string
	expiresAt: string
	role: string
	sessionVersion: string
}

interface ApiRequestConfig extends AxiosRequestConfig {
	authRetryAttempted?: boolean
	authSessionVersion?: string | null
	skipAuthRefresh?: boolean
	skipAuthorization?: boolean
}

interface ApiInternalRequestConfig extends InternalAxiosRequestConfig {
	authRetryAttempted?: boolean
	authSessionVersion?: string | null
	skipAuthRefresh?: boolean
	skipAuthorization?: boolean
}

interface RefreshAccessTokenOptions {
	expectedSessionVersion?: string | null
	failureMode?: "logout" | "silent"
}

class ApiClient {
	private instance: AxiosInstance
	private refreshPromise: Promise<AccessSessionResponse> | null = null

	constructor() {
		this.instance = axios.create({
			baseURL: API_BASE_URL,
			timeout: API_TIMEOUT,
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
		})
		this.setupInterceptors()
	}

	private setupInterceptors(): void {
		this.instance.interceptors.request.use(
			(config) => {
				const requestConfig = config as ApiInternalRequestConfig
				if (requestConfig.skipAuthorization) return requestConfig

				const credentials = getAuthCredentials()
				requestConfig.authSessionVersion = credentials.sessionVersion
				if (credentials.accessToken) requestConfig.headers.set("Authorization", `Bearer ${credentials.accessToken}`)
				return requestConfig
			},
			(error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error))),
		)

		this.instance.interceptors.response.use(
			(response) => response,
			async (error: unknown) => {
				if (!axios.isAxiosError(error) || error.response?.status !== 401) {
					return Promise.reject(error instanceof Error ? error : new Error(String(error)))
				}

				const requestConfig = error.config as ApiInternalRequestConfig | undefined
				if (!requestConfig || requestConfig.skipAuthRefresh || isAuthEndpoint(requestConfig.url)) {
					return Promise.reject(error)
				}

				const credentials = getAuthCredentials()
				const failedSessionVersion = requestConfig.authSessionVersion ?? credentials.sessionVersion
				if (!failedSessionVersion && !credentials.accessToken) return Promise.reject(error)

				if (requestConfig.authRetryAttempted) {
					this.endSession(failedSessionVersion)
					return Promise.reject(error)
				}

				requestConfig.authRetryAttempted = true
				try {
					const session = await this.refreshAccessToken({
						expectedSessionVersion: failedSessionVersion,
						failureMode: "logout",
					})
					requestConfig.authSessionVersion = session.sessionVersion
					requestConfig.headers.set("Authorization", `Bearer ${session.accessToken}`)
					return await this.instance.request(requestConfig)
				} catch {
					return Promise.reject(error)
				}
			},
		)
	}

	private endSession(sessionVersion: string | null): void {
		if (!sessionVersion || !clearAuth(sessionVersion)) return
		publishAuthEvent("session-ended", sessionVersion)
		redirectToLogin()
	}

	private async withRefreshLock<T>(task: () => Promise<T>): Promise<T> {
		if (typeof navigator === "undefined" || !("locks" in navigator)) return task()
		return navigator.locks.request(AUTH_REFRESH_LOCK, task)
	}

	async refreshAccessToken(options: RefreshAccessTokenOptions = {}): Promise<AccessSessionResponse> {
		if (this.refreshPromise) return this.refreshPromise

		const startedSessionVersion = options.expectedSessionVersion ?? getAuthCredentials().sessionVersion
		const promise = this.withRefreshLock<AccessSessionResponse>(async (): Promise<AccessSessionResponse> => {
			const current = getAuthCredentials()
			if (
				startedSessionVersion &&
				current.sessionVersion !== startedSessionVersion &&
				current.accessToken &&
				current.expiresAt &&
				current.role &&
				current.sessionVersion
			) {
				return {
					accessToken: current.accessToken,
					expiresAt: current.expiresAt,
					role: current.role,
					sessionVersion: current.sessionVersion,
				}
			}

			const refreshConfig: ApiRequestConfig = {
				method: "POST",
				url: "/auth/refresh",
				skipAuthRefresh: true,
				skipAuthorization: true,
			}
			const response = await this.instance.request<AccessSessionResponse>(refreshConfig)
			setAuthCredentials(response.data)
			return response.data
		})
			.catch((error: unknown) => {
				const currentSessionVersion = getAuthCredentials().sessionVersion
				if (currentSessionVersion !== startedSessionVersion) throw error

				const didClear = clearAuth(startedSessionVersion)
				if (didClear && options.failureMode === "logout" && startedSessionVersion) {
					publishAuthEvent("session-ended", startedSessionVersion)
					redirectToLogin()
				}
				throw error
			})
			.finally(() => {
				if (this.refreshPromise === promise) this.refreshPromise = null
			})

		this.refreshPromise = promise
		return promise
	}

	async get<T>(url: string, config?: ApiRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.get(url, config)
		return response.data
	}

	async post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.post(url, data, config)
		return response.data
	}

	async postRaw<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<AxiosResponse<T>> {
		return this.instance.post(url, data, config)
	}

	async put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.put(url, data, config)
		return response.data
	}

	async patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.patch(url, data, config)
		return response.data
	}

	async delete<T>(url: string, config?: ApiRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.delete(url, config)
		return response.data
	}
}

export const apiClient = new ApiClient()
