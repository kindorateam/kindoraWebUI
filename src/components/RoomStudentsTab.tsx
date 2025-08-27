import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'

interface RoomStudentsTabProps {
  roomId: string
}

// Mock data for demonstration
const mockStudents = [
  {
    id: '1',
    name: 'Emma Johnson',
    parents: 'Sarah & Mike Johnson',
    tags: ['Morning', 'Full Day'],
  },
  {
    id: '2',
    name: 'Oliver Smith',
    parents: 'Lisa Smith',
    tags: ['Afternoon', 'Special Needs'],
  },
  {
    id: '3',
    name: 'Sophia Brown',
    parents: 'David & Emma Brown',
    tags: ['Full Day'],
  },
]

const RoomStudentsTab = ({ roomId }: RoomStudentsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Students in Room {roomId}</h2>
        <p className="text-sm text-gray-600">
          Total: {mockStudents.length} students
        </p>
      </div>

      <Table aria-label="Students table">
        <TableHeader>
          <TableColumn>STUDENTS</TableColumn>
          <TableColumn>PARENTS</TableColumn>
          <TableColumn>TAGS</TableColumn>
        </TableHeader>
        <TableBody>
          {mockStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.parents}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {student.tags.map((tag) => (
                    <Chip key={tag} size="sm" variant="flat">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default RoomStudentsTab
