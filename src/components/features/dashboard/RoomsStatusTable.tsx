import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  AvatarGroup,
  Chip,
} from '@heroui/react'

import type { RoomStatus } from '@/types/dashboard.types'

interface RoomsStatusTableProps {
  rooms: RoomStatus[]
}

export function RoomsStatusTable({ rooms }: RoomsStatusTableProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-0">
        <h3 className="text-lg font-semibold">Rooms status today</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          <div className="grid grid-cols-4 text-xs font-medium text-gray-500 uppercase">
            <div>Rooms name</div>
            <div>Students signed in</div>
            <div>Expected</div>
            <div>Staff signed in</div>
          </div>
          {rooms.map((room) => (
            <div
              key={room.id}
              className="grid grid-cols-4 items-center border-t py-3"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
                <span className="text-sm font-medium">{room.name}</span>
              </div>
              <div>
                <AvatarGroup max={3} size="sm">
                  {room.students.map((student) => (
                    <Avatar
                      key={student.id}
                      src={student.avatar}
                      name={student.name}
                    />
                  ))}
                </AvatarGroup>
              </div>
              <div className="text-sm text-gray-600">{room.expectedStaff}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{room.staffSigned}</span>
                <Chip size="sm" variant="flat" color="success">
                  {room.ratio}
                </Chip>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
