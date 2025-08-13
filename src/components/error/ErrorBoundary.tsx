import { Component } from 'react'

import ErrorFallback from './ErrorFallback'
import { logError } from '@/utils/error.utils'

import type { ErrorBoundaryState, ErrorInfo } from '@/types/error.types'
import type { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (
    error: Error,
    resetError: () => void,
    errorInfo?: ErrorInfo,
  ) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: (string | number)[]
  resetOnPropsChange?: boolean
  isolate?: boolean
  level?: string
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private resetTimeoutId: number | null = null
  private previousResetKeys: (string | number)[] = []

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorBoundary: props.level,
    }
  }

  public static getDerivedStateFromError(
    error: Error,
  ): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level } = this.props

    // Log the error with context
    logError(error, {
      errorBoundary: level ?? 'unknown',
      componentStack: errorInfo.componentStack,
      digest: errorInfo.digest,
    })

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo)
    }

    // Update state with error info
    this.setState({
      errorInfo,
      errorBoundaryStack: [
        ...(this.state.errorBoundaryStack ?? []),
        level ?? 'unknown',
      ],
    })
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    // Reset on prop changes if enabled
    if (
      hasError &&
      resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.resetError()
    }

    // Reset when resetKeys change
    if (hasError && resetKeys && this.previousResetKeys !== resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== this.previousResetKeys[index],
      )
      if (hasResetKeyChanged) {
        this.resetError()
      }
    }
    this.previousResetKeys = resetKeys ?? []
  }

  resetError = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorBoundaryStack: [],
    })
  }

  override render() {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback, isolate } = this.props

    if (hasError && error) {
      // If isolate is true, don't propagate error to parent boundary
      if (isolate) {
        if (fallback) {
          return fallback(error, this.resetError, errorInfo ?? undefined)
        }
        return (
          <ErrorFallback
            error={error}
            resetError={this.resetError}
            errorInfo={errorInfo ?? undefined}
          />
        )
      }

      // Otherwise, use custom fallback or default
      if (fallback) {
        return fallback(error, this.resetError, errorInfo ?? undefined)
      }

      return (
        <ErrorFallback
          error={error}
          resetError={this.resetError}
          errorInfo={errorInfo ?? undefined}
        />
      )
    }

    return children
  }
}
