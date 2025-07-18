import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'https://pokeapi.co/api/v2'
const API_TIMEOUT = 30000

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth-token')
        if (token) {
          // Remove quotes from stored JSON string
          const cleanToken = token.replace(/^"|"$/g, '')
          config.headers.Authorization = `Bearer ${cleanToken}`
        }
        return config
      },
      (error: unknown) => {
        return Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        )
      },
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error: unknown) => {
        // Handle common errors
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Only clear auth data if this is NOT during initial auth check
          const isAuthCheck =
            error.config?.url?.includes('/auth/me') ??
            error.config?.url?.includes('/auth/verify')

          if (!isAuthCheck) {
            // For other API calls, we can consider the token invalid
            localStorage.removeItem('auth-token')
            localStorage.removeItem('auth-user')
            window.location.href = '/login'
          }
        }

        return Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        )
      },
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config)
    return response.data
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(
      url,
      data,
      config,
    )
    return response.data
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(
      url,
      data,
      config,
    )
    return response.data
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(
      url,
      data,
      config,
    )
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()
