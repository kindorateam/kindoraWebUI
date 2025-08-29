import type { RoomType } from '@/types/RoomNames'

export interface Student {
  id: string
  name: string
  avatar: string
  parents: Parent[]
  rooms: StudentRoom[]
  tags: Tag[]
  status?: string
}

export interface Parent {
  id: string
  name: string
  avatar?: string
  relationship: 'Mother' | 'Father' | 'Guardian'
}

export interface StudentRoom {
  id: string
  name: string
  icon: RoomType
}

export interface Tag {
  id: string
  name: string
  color: string
}

export default Student
