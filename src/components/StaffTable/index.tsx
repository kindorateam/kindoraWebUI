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
import { useCallback } from 'react'

import RoomIcon from '@/components/RoomIcon'
import usePinVisibility from '@/hooks/usePinVisibility'
import { getStaffMembers } from '@/services/staff.service'

import type Staff from '@/types/staff.types'

const columns = [
  { key: 'staff', label: 'Staff' },
  { key: 'role', label: 'Role' },
  { key: 'email', label: 'Email' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'pin', label: 'Pin' },
]

const StaffTable = () => {
  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: getStaffMembers,
  })

  const { isPinVisible, togglePinVisibility } = usePinVisibility()

  const renderCell = useCallback(
    (staff: Staff, columnKey: string) => {
      const isVisible = isPinVisible(staff.id)

      switch (columnKey) {
        case 'staff':
          return (
            <div className="flex items-center gap-3">
              <Avatar
                alt={staff.name}
                className="h-10 w-10"
                showFallback
                src={staff.avatar}
              />
              <div>
                <div className="text-sm font-medium">{staff.name}</div>
                {staff.isCurrentUser && (
                  <div className="text-xs text-green-500">My2 account</div>
                )}
              </div>
            </div>
          )

        case 'rooms':
          return (
            <div className="flex items-center gap-2">
              <RoomIcon roomType="turtle" />
              <span className="text-sm">Baby turtles</span>
            </div>
          )

        case 'role':
          return <span className="text-sm">{staff.role}</span>

        case 'email':
          return <span className="text-grey3 text-sm">{staff.email}</span>

        case 'pin':
          if (staff.isCurrentUser) {
            return (
              <Chip
                className="bg-gray-100 p-0! text-gray-800"
                classNames={{
                  base: 'p-0!',
                  content: 'p-0!',
                }}
                size="sm"
              >
                {staff.pin}
              </Chip>
            )
          }

          return isVisible ? (
            <Chip
              className="cursor-pointer bg-gray-100 p-0! text-gray-800"
              classNames={{
                base: 'p-0!',
                content: 'p-0!',
              }}
              onClick={() => togglePinVisibility(staff.id)}
              size="sm"
            >
              {staff.pin}
            </Chip>
          ) : (
            <Button
              className="bg-pink-100 text-pink-700 hover:bg-pink-200"
              onPress={() => {
                togglePinVisibility(staff.id)
              }}
              size="sm"
            >
              Reveal
            </Button>
          )

        default:
          return null
      }
    },
    [isPinVisible, togglePinVisibility],
  )

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table
        aria-label="Staff members table"
        classNames={{
          wrapper: 'min-w-full p-0 shadow-none! bg-transparent',
          base: 'p-0',
          thead: 'bg-transparent!',
          th: 'p-0',
          td: 'p-0',
        }}
      >
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
            <TableRow key={staff.id}>
              {(columnKey) => (
                <TableCell align="left" className="whitespace-nowrap">
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
