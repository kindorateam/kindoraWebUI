import { getRoomIcon, getRoomIconBg } from '@/utils/roomIcon'

import type { RoomType } from '@/types/RoomNames'

const RoomIcon = ({ roomType }: { roomType: RoomType }) => {
  const icon = getRoomIcon(roomType)
  const bg = getRoomIconBg(roomType)

  return (
    <div
      className={`flex items-center justify-center rounded-full lg:h-9 ${bg} lg:w-9`}
    >
      {icon}
    </div>
  )
}

export default RoomIcon
