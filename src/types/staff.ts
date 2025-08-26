export interface Staff {
  id: string
  name: string
  role: 'Admin' | 'Manager' | 'Staff'
  email: string
  avatar: string
  pin: string
  rooms: string[]
  isCurrentUser?: boolean
}

export interface StaffRoom {
  id: string
  name: string
  icon: string
}

export type PinVisibility = Record<string, boolean>

export default Staff
