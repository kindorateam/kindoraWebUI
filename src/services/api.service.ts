import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

import { clearToken, getCleanToken, refreshAccessToken } from "./token.service"

import { redirectToLogin } from "@/services/redirect.service"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1"
const API_TIMEOUT = 30000

class ApiClient {
	private instance: AxiosInstance

	constructor() {
		this.instance = axios.create({
			baseURL: API_BASE_URL,
			timeout: API_TIMEOUT,
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
				// Handle common errors
				if (axios.isAxiosError(error) && error.response?.status === 401) {
					const isAuthCheck =
						error.config?.url?.includes("/auth/me") ??
						error.config?.url?.includes("/auth/verify") ??
						error.config?.url?.includes("/auth/refresh")

					if (!isAuthCheck) {
						// Try to refresh token first
						const newToken = await refreshAccessToken()
						if (newToken) {
							// Retry the original request with new token
							const originalRequest = error.config
							if (originalRequest) {
								originalRequest.headers.Authorization = `Bearer ${newToken}`
								return this.instance.request(originalRequest)
							}
						}

						// If refresh failed or no original request, redirect to login
						clearToken()
						redirectToLogin()
					}
				}

				return Promise.reject(error instanceof Error ? error : new Error(String(error)))
			},
		)
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.get(url, config)
		return response.data
	}

	async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.instance.post(url, data, config)
		return response.data
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
