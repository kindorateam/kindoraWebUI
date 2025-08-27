import { Card, CardBody, Input, Textarea } from '@heroui/react'

interface RoomProfileTabProps {
  roomId: string
}

const RoomProfileTab = ({ roomId }: RoomProfileTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Room Profile - Room {roomId}</h2>

      <Card>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              defaultValue={`Room ${roomId}`}
              isReadOnly
              label="Room Name"
              placeholder="Enter room name"
            />
            <Input
              defaultValue="Classroom"
              isReadOnly
              label="Room Type"
              placeholder="Select room type"
            />
            <Input
              defaultValue="20"
              isReadOnly
              label="Capacity"
              placeholder="Enter capacity"
            />
            <Input
              defaultValue="15"
              isReadOnly
              label="Current Occupancy"
              placeholder="Current occupancy"
            />
          </div>

          <Textarea
            defaultValue="This room is designed for early childhood education with age-appropriate furniture and learning materials."
            isReadOnly
            label="Room Description"
            minRows={3}
            placeholder="Enter room description"
          />

          <div className="pt-4">
            <h3 className="mb-2 font-medium">Room Features</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>Interactive whiteboard</li>
              <li>Reading corner</li>
              <li>Art supplies station</li>
              <li>Natural lighting</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default RoomProfileTab
