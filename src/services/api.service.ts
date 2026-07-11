import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios"

import { publishAuthEvent } from "@/services/auth-events.service"
import { redirectToLogin } from "@/services/redirect.service"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1"
const API_TIMEOUT = 30000
const isAuthEndpoint = (url?: string): boolean => url?.includes("/auth/") ?? false

interface ApiRequestConfig extends AxiosRequestConfig {
	skipSessionEndedHandling?: boolean
}

interface ApiInternalRequestConfig extends InternalAxiosRequestConfig {
	skipSessionEndedHandling?: boolean
}

class ApiClient {
	private instance: AxiosInstance

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
			(config) => config,
			(error: unknown) => {
				return Promise.reject(error instanceof Error ? error : new Error(String(error)))
			},
		)

		// Response interceptor
		this.instance.interceptors.response.use(
			(response) => {
				return response
			},
			(error: unknown) => {
				if (!axios.isAxiosError(error) || error.response?.status !== 401) {
					return Promise.reject(error instanceof Error ? error : new Error(String(error)))
				}

				const requestConfig = error.config as ApiInternalRequestConfig | undefined
				if (!requestConfig || requestConfig.skipSessionEndedHandling || isAuthEndpoint(requestConfig.url)) {
					return Promise.reject(error)
				}

				publishAuthEvent("session-ended")
				redirectToLogin()
				return Promise.reject(error)
			},
		)
	}

	async get<T>(url: string, config?: ApiRequestConfig): Promise<T> {
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
