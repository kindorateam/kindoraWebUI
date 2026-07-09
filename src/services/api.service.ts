import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios"

import { redirectToLogin } from "@/services/redirect.service"
import { clearToken, getCleanToken, setTokens } from "@/services/token.service"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1"
const API_TIMEOUT = 30000

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
	_authRetryAttempted?: boolean
}

interface RefreshTokenResponse {
	accessToken: string
}

const isAuthEndpoint = (url?: string): boolean => url?.includes("/auth/") ?? false

class ApiClient {
	private instance: AxiosInstance
	private refreshInstance: AxiosInstance
	private refreshPromise: Promise<string | null> | null = null

	constructor() {
		this.instance = axios.create({
			baseURL: API_BASE_URL,
			timeout: API_TIMEOUT,
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
		})
		this.refreshInstance = axios.create({
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
		// Request interceptor
		this.instance.interceptors.request.use(
			(config) => {
				const cleanToken = getCleanToken()
				if (cleanToken) {
					config.headers.Authorization = `Bearer ${cleanToken}`
				}
				return config
			},
			(error: unknown) => {
				return Promise.reject(error instanceof Error ? error : new Error(String(error)))
			},
		)

		// Response interceptor
		this.instance.interceptors.response.use(
			(response) => {
				return response
			},
			async (error: unknown) => {
				if (!axios.isAxiosError(error) || error.response?.status !== 401) {
					return Promise.reject(error instanceof Error ? error : new Error(String(error)))
				}

				const originalRequest = error.config as RetryableRequestConfig | undefined
				if (!originalRequest || isAuthEndpoint(originalRequest.url)) {
					return Promise.reject(error)
				}

				if (originalRequest._authRetryAttempted) {
					clearToken()
					redirectToLogin()
					return Promise.reject(error)
				}

				originalRequest._authRetryAttempted = true
				const newToken = await this.refreshAccessToken()

				if (newToken) {
					originalRequest.headers.Authorization = `Bearer ${newToken}`
					return this.instance.request(originalRequest)
				}

				clearToken()
				redirectToLogin()
				return Promise.reject(error)
			},
		)
	}

	private async refreshAccessToken(): Promise<string | null> {
		if (this.refreshPromise) return this.refreshPromise

		this.refreshPromise = this.refreshInstance
			.post<RefreshTokenResponse>("/auth/refresh")
			.then(({ data }) => {
				setTokens(data.accessToken)
				return data.accessToken
			})
			.catch(() => null)
			.finally(() => {
				this.refreshPromise = null
			})

		return this.refreshPromise
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.get(url, config)
		return response.data
	}

	async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.post(url, data, config)
		return response.data
	}

	async postRaw<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.instance.post(url, data, config)
	}

	async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.put(url, data, config)
		return response.data
	}

	async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.patch(url, data, config)
		return response.data
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.delete(url, config)
		return response.data
	}
}

export const apiClient = new ApiClient()
