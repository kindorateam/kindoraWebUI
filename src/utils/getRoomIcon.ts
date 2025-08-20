import type { RoomType } from '@/types/roomTypes'

const getRoomIcon = (roomType: RoomType) => {
  switch (roomType) {
    case 'turtle':
      return '🐢'
    case 'zebra':
      return '🦓'
    case 'giraffe':
      return '🦒'
    case 'elephant':
      return '🐘'
    case 'mammoth':
      return '🦣'
  }
}

export default getRoomIcon
