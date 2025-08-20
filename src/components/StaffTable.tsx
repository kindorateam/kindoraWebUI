import {
  Avatar,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'

import RoomIcon from '@/components/RoomIcon'
import usePinVisibility from '@/hooks/usePinVisibility'
import { getStaffMembers } from '@/services/staff.service'

import type Staff from '@/types/staff.types'

const StaffTable = () => {
  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: getStaffMembers,
  })

  const { isPinVisible, togglePinVisibility } = usePinVisibility()

  const columns = [
    { key: 'staff', label: 'Staff' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'pin', label: 'Pin' },
  ]

  const renderCell = (staff: Staff, columnKey: string) => {
    const isVisible = isPinVisible(staff.id)

    switch (columnKey) {
      case 'staff':
        return (
          <div className="flex flex-col items-center gap-1">
            <Avatar
              alt={staff.name}
              className="h-10 w-10"
              showFallback
              src={staff.avatar}
            />
            <div className="text-center">
              <div className="text-sm font-medium">{staff.name}</div>
              {staff.isCurrentUser && (
                <div className="text-xs text-green-500">My account</div>
              )}
            </div>
          </div>
        )

      case 'role':
        return <span className="text-sm">{staff.role}</span>

      case 'email':
        return <span className="text-grey3 text-sm">{staff.email}</span>

      case 'rooms':
        return (
          <div className="flex items-center gap-2">
            <RoomIcon roomType="turtle" />
            <span className="text-sm">Baby turtles</span>
          </div>
        )

      case 'pin':
        if (staff.isCurrentUser) {
          // Always show pin for current user
          return (
            <Chip className="bg-gray-100 text-gray-800" size="sm">
              {staff.pin}
            </Chip>
          )
        }

        return isVisible ? (
          <Chip
            className="cursor-pointer bg-gray-100 text-gray-800"
            onClick={() => togglePinVisibility(staff.id)}
            size="sm"
          >
            {staff.pin}
          </Chip>
        ) : (
          <Button
            className="bg-pink-100 text-pink-700 hover:bg-pink-200"
            onClick={() => togglePinVisibility(staff.id)}
            size="sm"
          >
            Reveal
          </Button>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table aria-label="Staff members table" className="min-w-full">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              className="text-left text-sm font-medium tracking-wider text-gray-500 uppercase"
              key={column.key}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={staffMembers}>
          {(staff) => (
            <TableRow className="hover:bg-gray-50" key={staff.id}>
              {(columnKey) => (
                <TableCell className="whitespace-nowrap">
                  {renderCell(staff, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default StaffTable
