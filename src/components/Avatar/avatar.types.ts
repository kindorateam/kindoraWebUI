import type { ReactNode } from 'react'

export interface AvatarProps {
  alt: string
  border: boolean
  size: '24' | '28' | '36' | '40' | '150'
  src: string
}

export interface AvatarGroupProps {
  children: ReactNode[]
}
