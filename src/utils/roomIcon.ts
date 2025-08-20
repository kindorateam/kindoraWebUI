import type { RoomType } from '@/types/roomTypes'

export const getRoomIcon = (roomType: RoomType) => {
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

export const getRoomIconBg = (roomType: RoomType) => {
  switch (roomType) {
    case 'turtle':
      return 'bg-gradient-green'
    case 'zebra':
      return 'bg-gradient-gray'
    case 'giraffe':
      return 'bg-gradient-orange'
    case 'elephant':
      return 'bg-gradient-gray'
    case 'mammoth':
      return 'bg-gradient-orange'
  }
}

export default getRoomIconBg
