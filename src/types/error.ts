export interface ErrorInfo {
  componentStack: string
  digest?: string
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorBoundary?: string
  errorBoundaryStack?: string[]
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface AppError extends Error {
  code?: string
  severity?: ErrorSeverity
  context?: Record<string, unknown>
  timestamp?: string
  userMessage?: string
}

export interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  errorInfo?: ErrorInfo
}

export interface ErrorLogEntry {
  error: Error
  errorInfo?: ErrorInfo
  timestamp: string
  userAgent: string
  url: string
  userId?: string
  sessionId?: string
  context?: Record<string, unknown>
}
