export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface ApiError {
  message: string
  status: number
  details?: unknown
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  offset: number
  limit: number
  total: number
}
