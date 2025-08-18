import type { ReactNode } from 'react'

export interface NavDrawerItem {
  label: string
  path: string
  icon?: ReactNode
  badge?: number
  children?: NavDrawerItem[]
}
