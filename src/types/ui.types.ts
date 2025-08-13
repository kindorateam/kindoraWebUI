import type { ReactNode } from 'react'

export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: T[keyof T], item: T) => ReactNode
}

export type Size = 'sm' | 'md' | 'lg'
export type Color =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'default'
export type Variant =
  | 'solid'
  | 'bordered'
  | 'light'
  | 'flat'
  | 'faded'
  | 'shadow'
  | 'ghost'
