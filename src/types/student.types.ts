export interface Student {
  id: string
  firstName: string
  lastName: string
  avatar?: string
  room: Room
  parents: Parent[]
  tags: StudentTag[]
  status: StudentStatus
}

export interface Room {
  id: string
  name: string
  emoji: string
  color: string
}

export interface Parent {
  id: string
  firstName: string
  lastName: string
  avatar?: string
}

export interface StudentTag {
  id: string
  label: string
  color?: string
}

export type StudentStatus = 'active' | 'vacation' | 'sick' | 'inactive'

export interface StudentGroup {
  room: Room
  students: Student[]
  isExpanded: boolean
}

export interface StudentsFilterOptions {
  groupBy: 'rooms' | 'none'
  roomBy: string
  tagsBy: string
  statusBy: StudentStatus | 'active'
  searchQuery?: string
}
