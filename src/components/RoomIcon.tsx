import getRoomIcon from '@/utils/getRoomIcon'

import type { RoomType } from '@/types/roomTypes'

const RoomIcon = ({ roomType }: { roomType: RoomType }) => {
  const icon = getRoomIcon(roomType)

  return <div className="rounded-full lg:h-36">{icon}</div>
}

export default RoomIcon
